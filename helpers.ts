import * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const IMDB_BASE_URL = "https://imdb-api.com/en/API/";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780/";

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Builds an API request URL using Coda's fancy templating syntax for custom auth
 * (https://coda.github.io/packs-sdk/reference/sdk/interfaces/CustomAuthentication/)
 * which is needed because the imdb-api.com API requires the API Key to be delivered
 * as part of the URL path (not a query string parameter). For example (with k_12345678
 * as the api key): https://imdb-api.com/en/API/SearchMovie/k_12345678/incendies
 */

async function imdbApiFetch(
  context: coda.ExecutionContext,
  endpoint: string,
  query: string,
  options: string[]
) {
  // Build the URL
  let url =
    IMDB_BASE_URL +
    endpoint +
    "/{{imdbApiKey-" +
    context.invocationToken +
    "}}/" +
    encodeURIComponent(query);
  console.log("IMDB URL: " + url);
  // Add options to it, if any
  if (options.length) {
    url += "/";
    options.forEach((option) => {
      url += option + ",";
    });
  }
  const response = await context.fetcher.fetch({
    method: "GET",
    url: url,
  });
  return response;
}

async function tmdbApiFetch(
  context: coda.ExecutionContext,
  endpoint: string, // comes before the id in the URL
  id?: string,
  subEndpoint?: string, // comes after the movie in the URL
  params?: { [key: string]: string }
) {
  // Build the URL
  let url = TMDB_BASE_URL + endpoint;
  if (id) url += "/" + id;
  if (subEndpoint) url += "/" + subEndpoint;
  params = {
    ...params,
    api_key: "{{tmdbApiKey-" + context.invocationToken + "}}",
  };
  url = coda.withQueryParams(url, params);
  console.log("TMDB URL: " + url);
  const response = await context.fetcher.fetch({
    method: "GET",
    url,
  });
  // console.log(JSON.stringify(response, null, 2));
  return response;
}

/* -------------------------------------------------------------------------- */
/*                       Execute Functions for Formulas                       */
/* -------------------------------------------------------------------------- */

export async function getMovie(
  context: coda.ExecutionContext,
  query: string,
  countryCode: string = "US"
) {
  const nameSearchResponse = await imdbApiFetch(
    context,
    "SearchMovie",
    query,
    []
  );
  // We're always going to grab the top search result
  const nameSearchResult = nameSearchResponse.body.results[0];
  console.log("nameSearchResult: " + JSON.stringify(nameSearchResult, null, 2));
  // Now gather more details by hitting the IMDB API again, as well as the TMDB API
  const [imdbDetailResponse, tmdbDetailResponse] = await Promise.all([
    // Include Ratins with the detail request
    imdbApiFetch(context, "Title", nameSearchResult.id, ["Ratings"]),
    tmdbApiFetch(
      context,
      "find",
      nameSearchResult.id,
      null, // no sub-endpoint
      { external_source: "imdb_id" }
    ),
  ]);

  const imdbDetails = imdbDetailResponse.body;
  const tmdbDetails = tmdbDetailResponse.body.movie_results[0];
  console.log("imdbDetails: " + JSON.stringify(imdbDetails, null, 2));
  console.log("tmdbDetails: " + JSON.stringify(tmdbDetails, null, 2));

  // Get straeaming providers
  const streamingResult = await tmdbApiFetch(
    context,
    "movie",
    tmdbDetails.id,
    "watch/providers"
  );
  const streamingProviders = streamingResult?.body?.results[countryCode];

  return {
    // IMDB-derived fields
    ImdbId: nameSearchResult.id,
    Title: nameSearchResult.title,
    Description: nameSearchResult.description,
    VerticalPoster: nameSearchResult.image,
    ImdbLink: "https://imdb.com/title/" + nameSearchResult.id,
    Rating: imdbDetails.imDbRating,
    Metacritic: imdbDetails.metacriticRating,
    RottenTomatoes: imdbDetails.ratings.rottenTomatoes,
    Year: imdbDetails.year,
    Runtime: imdbDetails.runtimeMins + "minutes",
    Director: imdbDetails.directors.split(", "),
    Writer: imdbDetails.writers.split(", "),
    Starring: imdbDetails.stars.split(", "),
    Genres: imdbDetails.genres.split(", "),
    Countries: imdbDetails.countries.split(", "),
    Companies: imdbDetails.companies.split(", "),
    // TMDB-derived fields
    Poster: TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path,
    WatchLinks: streamingProviders?.link,
    Stream: streamingProviders?.flatrate.map(
      (provider) => provider.provider_name
    ),
    Buy: streamingProviders?.buy.map((provider) => provider.provider_name),
    Rent: streamingProviders?.rent.map((provider) => provider.provider_name),
  };
}
