import * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const IMDB_BASE_URL = "https://imdb-api.com/en/API/";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780/";
const IMDB_TITLE_ID_REGEX = new RegExp("^ttd+$"); // tt followed by 1 or more digits

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

export async function imdbApiFetch(
  context: coda.ExecutionContext,
  endpoint: string,
  query: string,
  options?: string[]
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
  if (options?.length) {
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

/**
 * Fetches data from the TMDb API
 * @param context
 * @param endpoint Main endpoint
 * @param id TMDB ID of the movie, series, etc.
 * @param subEndpoint Additional URL path after ID (e.g. "watch/providers")
 * @param params URL parameters (e.g. language, external_source for searching IMDB IDs)
 * @returns Promise resolving to the response
 */
export async function tmdbApiFetch(
  context: coda.ExecutionContext,
  endpoint: "movie" | "tv" | "find" | "watch/providers/regions", // comes before the id in the URL
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

/**
 * Convenience function to get initial data from TMDB based on IMDb ID
 */
export async function searchTmbdByImdbId(
  context: coda.ExecutionContext,
  imdbId: string
) {
  return tmdbApiFetch(
    context,
    "find",
    imdbId,
    null, // no sub-endpoint
    { external_source: "imdb_id" }
  );
}

/**
 * Build Coda-schema-ready object for streaming providers for a given TMDB ID
 */
async function getWatchProviders(
  context: coda.ExecutionContext,
  tmdbId: string,
  mediaType: "movie" | "tv",
  countryCode: string
) {
  const streamingResult = await tmdbApiFetch(
    context,
    mediaType,
    tmdbId,
    "watch/providers"
  );
  // We're just interested in the local providers
  const localProviders = streamingResult?.body?.results[countryCode];
  if (!localProviders) return null;
  return {
    stream: localProviders.flatrate
      ? localProviders.flatrate.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
    buy: localProviders.buy
      ? localProviders.buy.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
    rent: localProviders.rent
      ? localProviders.rent.map((provider) => ({
          name: provider.provider_name,
          country: countryCode,
        }))
      : [],
    link: localProviders.link,
  };
}

/**
 * Build Coda-schema-ready object for an array of people (actors, directors, etc.)
 * @param people Array of person objects from IMDb response
 * @param imageSource Special circumstance where a long list of actors includes images; we
 * don't usually want the full actor list, but want to query it to pull images for the main stars
 */
export function buildPeopleRecord(
  people: { id: string; name: string }[],
  imageSource?: {
    id: string;
    image: string;
    name: string;
    asCharacter: string;
  }[]
): { Name: string; ImdbLink: string; ImdbId: string; Photo?: string }[] {
  console.log("People:", JSON.stringify(people));
  // return null if there are no people
  if (!people || !people.length || !Array.isArray(people)) return null;
  // otherwise, process into People object
  return people.map((person) => {
    // grab the photo from the imageSource array if it exists
    let photo = null;
    if (imageSource && Array.isArray(imageSource) && imageSource.length) {
      photo = imageSource.find(
        (sourceRecord) => sourceRecord.id === person.id
      )?.image;
    }
    return {
      Name: person.name,
      ImdbLink: `https://imdb.com/name/${person.id}/`,
      ImdbId: person.id,
      Photo: photo,
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                       Execute Functions for Formulas                       */
/* -------------------------------------------------------------------------- */

export async function getMovie(
  context: coda.ExecutionContext,
  query: string,
  countryCode: string = "US"
) {
  let imdbId: string;

  // First, let's see if the user supplied an IMDb ID, or a regular search term
  if (IMDB_TITLE_ID_REGEX.test(query)) {
    imdbId = query;
  } else {
    // We start with a name search, to try to nail down an imdb ID that we can use to
    // fetch all our other data.
    const nameSearchResponse = await imdbApiFetch(
      context,
      "SearchMovie",
      query
    );
    // console.log(
    //   "Name search response:",
    //   JSON.stringify(nameSearchResponse.body, null, 2)
    // );
    if (nameSearchResponse.body.errorMessage)
      throw new coda.UserVisibleError(
        "Error: ",
        nameSearchResponse.body.errorMessage
      );
    if (
      !nameSearchResponse.body.results ||
      !nameSearchResponse.body.results.length
    )
      throw new coda.UserVisibleError("Couldn't find a movie with that title");
    // We're always going to grab the top search result
    const nameSearchResult = nameSearchResponse?.body?.results[0];
    imdbId = nameSearchResult?.id;
  }

  // Now gather more details by hitting the IMDB API again, as well as the TMDB API
  const [imdbDetailResponse, tmdbDetailResponse] = await Promise.all([
    // Include Ratings with the detail request
    imdbApiFetch(context, "Title", imdbId, ["Ratings,Trailer"]),
    searchTmbdByImdbId(context, imdbId),
  ]);

  const imdbDetails = imdbDetailResponse.body;
  const tmdbDetails = tmdbDetailResponse.body.movie_results[0];
  // console.log("imdbDetails: " + JSON.stringify(imdbDetails, null, 2));
  // console.log("tmdbDetails: " + JSON.stringify(tmdbDetails, null, 2));

  // Get straeaming providers
  let watchProviders: { [key: string]: any } = {}; // TODO: type this
  if (tmdbDetails) {
    watchProviders = await getWatchProviders(
      context,
      tmdbDetails?.id,
      "movie",
      countryCode
    );
  }

  const nonDigitCharacterPattern = /\D/g; // for converting box office data to numbers

  return {
    // IMDB-derived fields (detail API response)
    ImdbId: imdbDetails?.id,
    Description: imdbDetails?.description,
    Title: imdbDetails?.title,
    VerticalPoster: imdbDetails?.image,
    Year: imdbDetails?.year,
    Runtime: imdbDetails?.runtimeMins + " minutes",
    Director: buildPeopleRecord(imdbDetails?.directorList),
    Plot: imdbDetails?.plot,
    TrailerLink: imdbDetails?.trailer?.link,
    ImdbLink: "https://imdb.com/title/" + imdbId,
    ImdbRating: imdbDetails?.imDbRating,
    Metacritic: imdbDetails?.metacriticRating,
    RottenTomatoes: imdbDetails?.ratings?.rottenTomatoes,
    ContentRating: imdbDetails?.contentRating,
    Writer: buildPeopleRecord(imdbDetails?.writerList),
    Starring: buildPeopleRecord(imdbDetails?.starList, imdbDetails?.actorList),
    Genres: imdbDetails?.genres ? imdbDetails.genres.split(", ") : [],
    Countries: imdbDetails?.countries ? imdbDetails.countries.split(", ") : [],
    Companies: imdbDetails?.companies ? imdbDetails.companies.split(", ") : [],
    BoxOffice: {
      Budget: imdbDetails?.boxOffice?.budget?.replace(
        nonDigitCharacterPattern,
        ""
      ) as number,
      USAGross: imdbDetails?.boxOffice?.grossUSA?.replace(
        nonDigitCharacterPattern,
        ""
      ) as number,
      GlobalGross: imdbDetails?.boxOffice?.cumulativeWorldwideGross?.replace(
        nonDigitCharacterPattern,
        ""
      ) as number,
      USAOpeningWeekend: imdbDetails?.boxOffice?.openingWeekendUSA?.replace(
        nonDigitCharacterPattern,
        ""
      ) as number,
    },
    // TMDB-derived fields
    HorizontalPoster: TMDB_IMAGE_BASE_URL + tmdbDetails?.backdrop_path,
    WatchLinks: watchProviders?.link,
    Stream: watchProviders?.stream,
    Buy: watchProviders?.buy,
    Rent: watchProviders?.rent,
  };
}

export async function getSeries(
  context: coda.ExecutionContext,
  query: string,
  countryCode: string = "US"
) {
  // We start with a name search, to try to nail down an imdb ID that we can use to
  // fetch all our other data.
  const nameSearchResponse = await imdbApiFetch(context, "SearchSeries", query);
  if (nameSearchResponse.body.errorMessage)
    throw new coda.UserVisibleError(
      "Error: ",
      nameSearchResponse.body.errorMessage
    );
  if (
    !nameSearchResponse.body.results ||
    !nameSearchResponse.body.results.length
  )
    throw new coda.UserVisibleError("Couldn't find a TV show with that title");
  // We're always going to grab the top search result
  const nameSearchResult = nameSearchResponse?.body?.results[0];

  // Now gather more details by hitting the IMDB API again, and hit the TMDB API
  // to get basic TMDB details including the TMDB id
  const [imdbDetailResponse, tmdbSearchResponse] = await Promise.all([
    // Include Ratings and Trailer with the detail request
    imdbApiFetch(context, "Title", nameSearchResult.id, ["Ratings,Trailer"]),
    searchTmbdByImdbId(context, nameSearchResult.id),
  ]);

  const imdbDetails = imdbDetailResponse.body;
  const tmdbSearchDetails = tmdbSearchResponse.body.tv_results[0];
  console.log("imdbDetails: " + JSON.stringify(imdbDetails, null, 2));
  console.log(
    "tmdbSearchDetails: " + JSON.stringify(tmdbSearchDetails, null, 2)
  );

  // Get streaming providers and additional TMDB details
  let watchProviders: { [key: string]: any } = {}; // TODO: type this
  let tmdbDetailResponse;
  let seasons: { [key: string]: any }[] = [{}]; // TODO: type this
  if (tmdbSearchDetails) {
    [watchProviders, tmdbDetailResponse] = await Promise.all([
      getWatchProviders(context, tmdbSearchDetails?.id, "tv", countryCode),
      tmdbApiFetch(context, "tv", tmdbSearchDetails?.id),
    ]);
  }
  const tmdbDetails = tmdbDetailResponse?.body;
  if (tmdbDetails.seasons) {
    seasons = tmdbDetails.seasons.map((season) => {
      return {
        SeasonNumber: season.season_number,
        SeasonName: season.name,
        EpisodeCount: season.episode_count,
        AirDate: season.air_date,
      };
    });
  }

  return {
    // IMDB-derived fields (initial API response)
    ImdbId: nameSearchResult?.id,
    Description: nameSearchResult?.description,
    Title: nameSearchResult?.title,
    VerticalPoster: nameSearchResult?.image,
    // IMDB-derived fields (detail API response)
    FullTitle: imdbDetails?.fullTitle,
    Creators: buildPeopleRecord(imdbDetails?.tvSeriesInfo?.creatorList),
    Years: {
      StartYear: imdbDetails?.year,
      EndYear: imdbDetails?.tvSeriesInfo?.yearEnd,
      Years: `${imdbDetails?.year}-${imdbDetails?.tvSeriesInfo?.yearEnd}`,
    },
    ImdbLink: "https://imdb.com/title/" + nameSearchResult?.id,
    ContentRating: imdbDetails?.contentRating,
    ImdbRating: imdbDetails?.imDbRating,
    Metacritic: imdbDetails?.metacriticRating,
    RottenTomatoes: imdbDetails?.ratings?.rottenTomatoes,
    Plot: imdbDetails?.plot,
    Starring: buildPeopleRecord(imdbDetails?.starList, imdbDetails?.actorList),
    Genres: imdbDetails?.genres ? imdbDetails.genres.split(", ") : [],
    Countries: imdbDetails?.countries ? imdbDetails.countries.split(", ") : [],
    Companies: imdbDetails?.companies ? imdbDetails.companies.split(", ") : [],
    TrailerLink: imdbDetails?.trailer?.link,
    // TMDB-derived fields
    HorizontalPoster: TMDB_IMAGE_BASE_URL + tmdbSearchDetails?.backdrop_path,
    WatchLinks: watchProviders?.link,
    Stream: watchProviders?.stream,
    Buy: watchProviders?.buy,
    Rent: watchProviders?.rent,
    Seasons: seasons,
    Networks: tmdbDetails?.networks
      ? tmdbDetails.networks.map((network) => network.name)
      : [],
    NextEpisodeAirDate: tmdbDetails.next_episode_to_air?.air_date,
    Status: tmdbDetails.status,
  };
}

/* -------------------------------------------------------------------------- */
/*                           Autocomplete Functions                           */
/* -------------------------------------------------------------------------- */

export async function autocompleteCountryCode(
  context: coda.ExecutionContext,
  search: string
) {
  let response = await tmdbApiFetch(context, "watch/providers/regions");
  let results = response.body.results;
  // Generate an array of autocomplete objects, using the native_name field as the
  // label and its country code for the value.
  return coda.autocompleteSearchObjects(
    search,
    results,
    "native_name",
    "iso_3166_1"
  );
}
