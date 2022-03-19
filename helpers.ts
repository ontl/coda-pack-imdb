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
  // We start with a name search, to try to nail down an imdb ID that we can use to
  // fetch all our other data.
  const nameSearchResponse = await imdbApiFetch(
    context,
    "SearchMovie",
    query,
    []
  );
  // We're always going to grab the top search result
  const nameSearchResult = nameSearchResponse?.body?.results[0];
  if (!nameSearchResult)
    throw new coda.UserVisibleError("Couldn't find a movie with that title");
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
  let watchProviders: { [key: string]: any } = {};
  if (tmdbDetails) {
    const streamingResult = await tmdbApiFetch(
      context,
      "movie",
      tmdbDetails?.id,
      "watch/providers"
    );
    // We're just interested in the local providers
    watchProviders = streamingResult?.body?.results[countryCode];
  }

  return {
    // IMDB-derived fields
    ImdbId: nameSearchResult?.id,
    Description: nameSearchResult?.description,
    Title: nameSearchResult?.title,
    Year: imdbDetails?.year,
    Director: imdbDetails?.directors.split(", "),
    Runtime: imdbDetails?.runtimeMins + " minutes",
    ImdbLink: "https://imdb.com/title/" + nameSearchResult?.id,
    VerticalPoster: nameSearchResult?.image,
    ImdbRating: imdbDetails?.imDbRating,
    Metacritic: imdbDetails?.metacriticRating,
    RottenTomatoes: imdbDetails?.ratings?.rottenTomatoes,
    Writer: imdbDetails?.writers.split(", "),
    Starring: imdbDetails?.stars.split(", "),
    Genres: imdbDetails?.genres.split(", "),
    Countries: imdbDetails?.countries.split(", "),
    Companies: imdbDetails?.companies.split(", "),
    // TMDB-derived fields
    HorizontalPoster: TMDB_IMAGE_BASE_URL + tmdbDetails?.backdrop_path,
    WatchLinks: watchProviders?.link,
    Stream: watchProviders?.flatrate
      ? watchProviders.flatrate.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
    Buy: watchProviders?.buy
      ? watchProviders.buy.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
    Rent: watchProviders?.rent
      ? watchProviders.rent.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
  };
}
