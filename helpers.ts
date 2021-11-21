import type * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const baseURL = "https://imdb-api.com/en/API/";

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

function buildRequestUrl(
  context: coda.ExecutionContext,
  endPoint: string,
  query: string,
  options: string[]
) {
  let url =
    baseURL +
    endPoint +
    "/{{apiKey-" +
    context.invocationToken +
    "}}/" +
    encodeURIComponent(query);
  if (options.length) {
    url += "/";
    options.forEach((option) => {
      url += option + ",";
    });
  }
  return url;
}

async function apiFetch(
  context: coda.ExecutionContext,
  endpoint: string,
  query: string,
  options: string[]
) {
  const response = await context.fetcher.fetch({
    method: "GET",
    url: buildRequestUrl(context, endpoint, query, options),
  });
  return response;
}

/* -------------------------------------------------------------------------- */
/*                       Execute Functions for Formulas                       */
/* -------------------------------------------------------------------------- */

export async function getMovie(context: coda.ExecutionContext, query: string) {
  const movieResponse = await apiFetch(context, "SearchMovie", query, []);
  const movieResult = movieResponse.body.results[0];
  const detailResponse = await apiFetch(context, "Title", movieResult.id, [
    "Ratings",
  ]);
  const detailResult = detailResponse.body;
  return {
    IMDBId: movieResult.id,
    Title: movieResult.title,
    Description: movieResult.description,
    Poster: movieResult.image,
    Rating: detailResult.imDbRating,
    Metacritic: detailResult.metacriticRating,
    RottenTomatoes: detailResult.ratings.rottenTomatoes,
    Link: "https://imdb.com/title/" + movieResult.id,
    Year: detailResult.year,
    Runtime: detailResult.runtimeMins + "minutes",
    Director: detailResult.directors,
    Writer: detailResult.writers,
    Starring: detailResult.stars,
    Genres: detailResult.genres,
    Countries: detailResult.countries,
    Companies: detailResult.companies,
  };
}
