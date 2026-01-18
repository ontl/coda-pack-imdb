import * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const IMDB_API_BASE_URL = "https://api.imdbapi.dev/";
const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780/";
const IMDB_TITLE_ID_REGEX = /^tt\d+$/; // tt followed by 1 or more digits
const IMDB_PERSON_ID_REGEX = /^nm\d+$/; // nm followed by 1 or more digits

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Fetches data from the imdbapi.dev API (no authentication required)
 * @param context Coda execution context
 * @param endpoint API endpoint path (e.g. "titles/tt1234567" or "search/titles")
 * @param params Optional query parameters
 * @returns Promise resolving to the response
 */
export async function imdbApiDevFetch(
  context: coda.ExecutionContext,
  endpoint: string,
  params?: { [key: string]: string | number }
) {
  let url = IMDB_API_BASE_URL + endpoint;
  if (params) {
    url = coda.withQueryParams(url, params);
  }
  const response = await context.fetcher.fetch({
    method: "GET",
    url,
    cacheTtlSecs: 60 * 60 * 24,
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
  endpoint: "movie" | "tv" | "find" | "watch/providers/regions" | "search/person" | "person",
  id?: string,
  subEndpoint?: string, // comes after the id in the URL (e.g. "videos", "release_dates", "content_ratings", "external_ids")
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
    cacheTtlSecs: 60 * 60 * 24,
  });
  return response;
}

/**
 * Convenience function to get initial data from TMDB based on IMDb ID
 */
export async function searchTmdbByImdbId(
  context: coda.ExecutionContext,
  imdbId: string
) {
  return tmdbApiFetch(
    context,
    "find",
    imdbId,
    undefined, // no sub-endpoint
    { external_source: "imdb_id" }
  );
}

/**
 * Search for a person on TMDB by name and get their IMDB ID
 * Used because imdbapi.dev doesn't have a person search endpoint
 */
async function searchPersonAndGetImdbId(
  context: coda.ExecutionContext,
  name: string
): Promise<string | null> {
  // Search for the person on TMDB
  const searchResponse = await tmdbApiFetch(
    context,
    "search/person",
    undefined,
    undefined,
    { query: name }
  );

  const results = searchResponse?.body?.results;
  if (!results || !results.length) {
    return null;
  }

  // Get the first result's TMDB ID
  const tmdbPersonId = results[0].id;

  // Get the external IDs for this person to find their IMDB ID
  const externalIdsResponse = await tmdbApiFetch(
    context,
    "person",
    String(tmdbPersonId),
    "external_ids"
  );

  return externalIdsResponse?.body?.imdb_id || null;
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
 * Get trailer URL from TMDB videos endpoint
 * Looks for official trailers first, then any trailer, then any video
 */
async function getTmdbTrailer(
  context: coda.ExecutionContext,
  tmdbId: string,
  mediaType: "movie" | "tv"
): Promise<string | undefined> {
  const videosResponse = await tmdbApiFetch(context, mediaType, tmdbId, "videos");
  const videos = videosResponse?.body?.results;
  if (!videos || !videos.length) return undefined;

  // Prefer official trailers from YouTube
  const officialTrailer = videos.find(
    (v: any) => v.type === "Trailer" && v.official && v.site === "YouTube"
  );
  if (officialTrailer) {
    return `https://www.youtube.com/watch?v=${officialTrailer.key}`;
  }

  // Fall back to any trailer
  const anyTrailer = videos.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );
  if (anyTrailer) {
    return `https://www.youtube.com/watch?v=${anyTrailer.key}`;
  }

  // Fall back to any YouTube video
  const anyVideo = videos.find((v: any) => v.site === "YouTube");
  if (anyVideo) {
    return `https://www.youtube.com/watch?v=${anyVideo.key}`;
  }

  return undefined;
}

/**
 * Get content rating from TMDB
 * For movies, uses release_dates endpoint (certifications per country)
 * For TV, uses content_ratings endpoint
 */
async function getTmdbContentRating(
  context: coda.ExecutionContext,
  tmdbId: string,
  mediaType: "movie" | "tv",
  countryCode: string = "US"
): Promise<string | undefined> {
  if (mediaType === "movie") {
    const releaseDatesResponse = await tmdbApiFetch(
      context,
      "movie",
      tmdbId,
      "release_dates"
    );
    const results = releaseDatesResponse?.body?.results;
    if (!results) return undefined;

    // Find the rating for the requested country
    const countryRelease = results.find(
      (r: any) => r.iso_3166_1 === countryCode
    );
    if (countryRelease?.release_dates?.length) {
      // Get the theatrical or first release with a certification
      const ratedRelease = countryRelease.release_dates.find(
        (rd: any) => rd.certification
      );
      if (ratedRelease?.certification) {
        return ratedRelease.certification;
      }
    }

    // Fall back to US rating if requested country not found
    if (countryCode !== "US") {
      const usRelease = results.find((r: any) => r.iso_3166_1 === "US");
      if (usRelease?.release_dates?.length) {
        const ratedRelease = usRelease.release_dates.find(
          (rd: any) => rd.certification
        );
        if (ratedRelease?.certification) {
          return ratedRelease.certification;
        }
      }
    }
  } else {
    // TV content ratings
    const contentRatingsResponse = await tmdbApiFetch(
      context,
      "tv",
      tmdbId,
      "content_ratings"
    );
    const results = contentRatingsResponse?.body?.results;
    if (!results) return undefined;

    // Find the rating for the requested country
    const countryRating = results.find(
      (r: any) => r.iso_3166_1 === countryCode
    );
    if (countryRating?.rating) {
      return countryRating.rating;
    }

    // Fall back to US rating
    if (countryCode !== "US") {
      const usRating = results.find((r: any) => r.iso_3166_1 === "US");
      if (usRating?.rating) {
        return usRating.rating;
      }
    }
  }

  return undefined;
}

/**
 * Build Coda-schema-ready object for an array of people (actors, directors, etc.)
 * @param people Array of person objects from imdbapi.dev response
 *               New structure: { id: string, displayName: string, primaryImage?: { url: string } }
 */
export function buildPeopleRecord(
  people: {
    id: string;
    displayName?: string;
    name?: string; // fallback for old format
    primaryImage?: { url: string };
    image?: string; // fallback for old format
  }[]
):
  | {
      Name: string;
      ImdbLink: string;
      ImdbId: string;
      Photo?: string | undefined;
    }[]
  | undefined {
  // return undefined if there are no people
  if (!people || !people.length || !Array.isArray(people)) return undefined;

  // Process into People object, supporting both new and old formats
  return people.map((person) => {
    // Support both new (displayName) and old (name) formats
    const name = person.displayName || person.name || "Unknown";
    // Support both new (primaryImage.url) and old (image) formats
    const photo = person.primaryImage?.url || person.image;

    return {
      Name: name,
      ImdbLink: `https://imdb.com/name/${person.id}/`,
      ImdbId: person.id,
      Photo: photo,
    };
  });
}

function age(birthDate: string, deathDate?: string) {
  const birthDateObject = new Date(birthDate);
  const endDateObject = deathDate ? new Date(deathDate) : new Date();
  const age = endDateObject.getFullYear() - birthDateObject.getFullYear();
  const m = endDateObject.getMonth() - birthDateObject.getMonth();
  if (
    m < 0 ||
    (m === 0 && endDateObject.getDate() < birthDateObject.getDate())
  ) {
    return age - 1;
  }
  return age;
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
    // Search for the movie using imdbapi.dev
    const searchResponse = await imdbApiDevFetch(context, "search/titles", {
      query: query,
    });

    const searchResults = searchResponse?.body?.titles;
    if (!searchResults || !searchResults.length) {
      throw new coda.UserVisibleError("Couldn't find a movie with that title");
    }

    // Filter for movies (not TV series) and get the first result
    const movieResult = searchResults.find(
      (t: any) => t.type === "movie" || t.type === "MOVIE"
    ) || searchResults[0];
    imdbId = movieResult?.id;
  }

  // Now gather details from imdbapi.dev and TMDB in parallel
  const [imdbDetailResponse, imdbBoxOfficeResponse, tmdbSearchResponse] =
    await Promise.all([
      imdbApiDevFetch(context, `titles/${imdbId}`),
      imdbApiDevFetch(context, `titles/${imdbId}/boxOffice`),
      searchTmdbByImdbId(context, imdbId),
    ]);

  const imdbDetails = imdbDetailResponse.body;
  const boxOffice = imdbBoxOfficeResponse.body;
  const tmdbDetails = tmdbSearchResponse?.body?.movie_results?.[0];

  // Get streaming providers, trailer, and content rating from TMDB
  let watchProviders: {
    stream?: any;
    buy?: any;
    rent?: any;
    link?: any;
  } | null = {};
  let trailerLink: string | undefined;
  let contentRating: string | undefined;

  if (tmdbDetails?.id) {
    const tmdbId = String(tmdbDetails.id);
    [watchProviders, trailerLink, contentRating] = await Promise.all([
      getWatchProviders(context, tmdbId, "movie", countryCode),
      getTmdbTrailer(context, tmdbId, "movie"),
      getTmdbContentRating(context, tmdbId, "movie", countryCode),
    ]);
  }

  // Convert runtime from seconds to minutes string
  const runtimeMinutes = imdbDetails?.runtimeSeconds
    ? Math.round(imdbDetails.runtimeSeconds / 60)
    : null;

  return {
    // IMDB-derived fields (from imdbapi.dev)
    ImdbId: imdbDetails?.id,
    Title: imdbDetails?.primaryTitle,
    VerticalPoster: imdbDetails?.primaryImage?.url,
    Year: imdbDetails?.startYear,
    Runtime: runtimeMinutes ? `${runtimeMinutes} minutes` : undefined,
    Director: buildPeopleRecord(imdbDetails?.directors),
    Writer: buildPeopleRecord(imdbDetails?.writers),
    Starring: buildPeopleRecord(imdbDetails?.stars),
    Plot: imdbDetails?.plot,
    ImdbLink: "https://imdb.com/title/" + imdbId,
    ImdbRating: imdbDetails?.rating?.aggregateRating,
    Metacritic: imdbDetails?.metacritic?.score,
    Genres: imdbDetails?.genres || [],
    Countries: imdbDetails?.originCountries
      ? imdbDetails.originCountries.map((c: any) => c.name)
      : [],
    BoxOffice: {
      Budget: boxOffice?.productionBudget?.amount
        ? Number(boxOffice.productionBudget.amount)
        : undefined,
      USAGross: boxOffice?.domesticGross?.amount
        ? Number(boxOffice.domesticGross.amount)
        : undefined,
      GlobalGross: boxOffice?.worldwideGross?.amount
        ? Number(boxOffice.worldwideGross.amount)
        : undefined,
      USAOpeningWeekend: boxOffice?.openingWeekendGross?.gross?.amount
        ? Number(boxOffice.openingWeekendGross.gross.amount)
        : undefined,
    },
    // TMDB-derived fields
    HorizontalPoster: tmdbDetails?.backdrop_path
      ? TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path
      : undefined,
    TrailerLink: trailerLink,
    ContentRating: contentRating,
    WatchLinks: watchProviders?.link,
    Stream: watchProviders?.stream,
    Buy: watchProviders?.buy,
    Rent: watchProviders?.rent,
    // Description field - use plot as description
    Description: imdbDetails?.plot,
    // Companies - need separate API call, leaving empty for now
    Companies: [],
  };
}

export async function getSeries(
  context: coda.ExecutionContext,
  query: string,
  countryCode: string = "US"
) {
  let imdbId: string;

  // First, let's see if the user supplied an IMDb ID, or a regular search term
  if (IMDB_TITLE_ID_REGEX.test(query)) {
    imdbId = query;
  } else {
    // Search for the series using imdbapi.dev
    const searchResponse = await imdbApiDevFetch(context, "search/titles", {
      query: query,
    });

    const searchResults = searchResponse?.body?.titles;
    if (!searchResults || !searchResults.length) {
      throw new coda.UserVisibleError(
        "Couldn't find a TV show with that title"
      );
    }

    // Filter for TV series and get the first result
    const seriesResult = searchResults.find(
      (t: any) =>
        t.type === "tvSeries" ||
        t.type === "TV_SERIES" ||
        t.type === "tvMiniSeries" ||
        t.type === "TV_MINI_SERIES"
    ) || searchResults[0];
    imdbId = seriesResult?.id;
  }

  // Gather details from imdbapi.dev and TMDB in parallel
  const [imdbDetailResponse, imdbSeasonsResponse, tmdbSearchResponse] =
    await Promise.all([
      imdbApiDevFetch(context, `titles/${imdbId}`),
      imdbApiDevFetch(context, `titles/${imdbId}/seasons`),
      searchTmdbByImdbId(context, imdbId),
    ]);

  const imdbDetails = imdbDetailResponse.body;
  const imdbSeasons = imdbSeasonsResponse?.body?.seasons || [];
  const tmdbSearchDetails = tmdbSearchResponse?.body?.tv_results?.[0];

  // Get streaming providers, trailer, content rating, and additional TMDB details
  let watchProviders: { [key: string]: any } | null = {};
  let trailerLink: string | undefined;
  let contentRating: string | undefined;
  let tmdbDetails: any = {};
  let seasons: { [key: string]: any }[] = [];

  if (tmdbSearchDetails?.id) {
    const tmdbId = String(tmdbSearchDetails.id);
    const [providers, trailer, rating, tmdbDetailResponse] = await Promise.all([
      getWatchProviders(context, tmdbId, "tv", countryCode),
      getTmdbTrailer(context, tmdbId, "tv"),
      getTmdbContentRating(context, tmdbId, "tv", countryCode),
      tmdbApiFetch(context, "tv", tmdbId),
    ]);
    watchProviders = providers;
    trailerLink = trailer;
    contentRating = rating;
    tmdbDetails = tmdbDetailResponse?.body || {};
  }

  // Build seasons data - prefer TMDB data for air dates, IMDB for episode counts
  if (tmdbDetails?.seasons) {
    seasons = tmdbDetails.seasons.map((season: any) => ({
      SeasonNumber: season.season_number,
      SeasonName: season.name,
      EpisodeCount: season.episode_count,
      AirDate: season.air_date,
    }));
  } else if (imdbSeasons.length) {
    // Fall back to imdbapi.dev seasons data
    seasons = imdbSeasons.map((season: any) => ({
      SeasonNumber: parseInt(season.season) || 0,
      SeasonName: `Season ${season.season}`,
      EpisodeCount: season.episodeCount,
      AirDate: undefined,
    }));
  }

  // Get creators from credits endpoint if needed
  let creators: any[] = [];
  if (imdbDetails?.writers && imdbDetails.writers.length > 0) {
    // Use writers as creators for now (the /credits endpoint would need pagination)
    creators = imdbDetails.writers;
  }

  // Build years object
  const startYear = imdbDetails?.startYear;
  const endYear = imdbDetails?.endYear;
  const yearsString = endYear
    ? `${startYear}-${endYear}`
    : startYear
    ? `${startYear}-`
    : "";

  return {
    // IMDB-derived fields (from imdbapi.dev)
    ImdbId: imdbId,
    Title: imdbDetails?.primaryTitle,
    FullTitle: imdbDetails?.originalTitle || imdbDetails?.primaryTitle,
    VerticalPoster: imdbDetails?.primaryImage?.url,
    Creators: buildPeopleRecord(creators),
    Years: {
      StartYear: startYear ? String(startYear) : undefined,
      EndYear: endYear ? String(endYear) : undefined,
      Years: yearsString,
    },
    ImdbLink: "https://imdb.com/title/" + imdbId,
    ImdbRating: imdbDetails?.rating?.aggregateRating,
    Metacritic: imdbDetails?.metacritic?.score,
    Plot: imdbDetails?.plot,
    Starring: buildPeopleRecord(imdbDetails?.stars),
    Genres: imdbDetails?.genres || [],
    Countries: imdbDetails?.originCountries
      ? imdbDetails.originCountries.map((c: any) => c.name)
      : [],
    // TMDB-derived fields
    HorizontalPoster: tmdbSearchDetails?.backdrop_path
      ? TMDB_IMAGE_BASE_URL + tmdbSearchDetails.backdrop_path
      : undefined,
    TrailerLink: trailerLink,
    ContentRating: contentRating,
    WatchLinks: watchProviders?.link,
    Stream: watchProviders?.stream,
    Buy: watchProviders?.buy,
    Rent: watchProviders?.rent,
    Seasons: seasons,
    Networks: tmdbDetails?.networks
      ? tmdbDetails.networks.map((network: any) => network.name)
      : [],
    NextEpisodeAirDate: tmdbDetails?.next_episode_to_air?.air_date,
    Status: tmdbDetails?.status,
    // Description field - use plot
    Description: imdbDetails?.plot,
    // Companies - leaving empty as it requires separate API call
    Companies: [],
  };
}

export async function getPerson(context: coda.ExecutionContext, query: string) {
  let imdbId: string;

  // First, let's see if the user supplied an IMDb ID, or a regular search term
  if (IMDB_PERSON_ID_REGEX.test(query)) {
    imdbId = query;
  } else {
    // imdbapi.dev doesn't have a person search endpoint, so we use TMDB
    const foundImdbId = await searchPersonAndGetImdbId(context, query);
    if (!foundImdbId) {
      throw new coda.UserVisibleError("Couldn't find a person with that name");
    }
    imdbId = foundImdbId;
  }

  // Get person details and filmography from imdbapi.dev
  const [personResponse, filmographyResponse] = await Promise.all([
    imdbApiDevFetch(context, `names/${imdbId}`),
    imdbApiDevFetch(context, `names/${imdbId}/filmography`, { pageSize: 10 }),
  ]);

  const personDetails = personResponse.body;
  const filmography = filmographyResponse?.body?.credits || [];

  // Build knownFor from filmography
  let knownFor: { [key: string]: any }[] = [];
  for (const credit of filmography.slice(0, 4)) {
    // Limit to 4 items
    const title = credit.title;
    if (title) {
      knownFor.push({
        Summary: `${credit.category || "Role"}, ${title.primaryTitle} (${title.startYear || ""})`,
        Title: title.primaryTitle,
        Role: credit.category,
        Year: title.startYear ? String(title.startYear) : undefined,
        ImdbId: title.id,
        ImdbLink: "https://imdb.com/title/" + title.id,
        Poster: title.primaryImage?.url,
      });
    }
  }

  // Convert PrecisionDate objects to strings
  const birthDateStr = personDetails?.birthDate
    ? formatPrecisionDate(personDetails.birthDate)
    : undefined;
  const deathDateStr = personDetails?.deathDate
    ? formatPrecisionDate(personDetails.deathDate)
    : undefined;

  // Convert height from cm to string
  const heightStr = personDetails?.heightCm
    ? `${Math.floor(personDetails.heightCm / 2.54 / 12)}'${Math.round(
        (personDetails.heightCm / 2.54) % 12
      )}" (${personDetails.heightCm} cm)`
    : undefined;

  return {
    Name: personDetails?.displayName,
    Description: knownFor[0]?.Summary,
    Photo: personDetails?.primaryImage?.url,
    Roles: personDetails?.primaryProfessions || [],
    KnownFor: knownFor,
    Bio: personDetails?.biography,
    BirthDate: birthDateStr,
    DeathDate: deathDateStr,
    Age: birthDateStr ? age(birthDateStr, deathDateStr) : undefined,
    Height: heightStr,
    ImdbLink: "https://imdb.com/name/" + imdbId,
    ImdbId: imdbId,
  };
}

/**
 * Format a PrecisionDate object (from imdbapi.dev) to a date string
 */
function formatPrecisionDate(precisionDate: {
  year?: number;
  month?: number;
  day?: number;
}): string | undefined {
  if (!precisionDate.year) return undefined;

  const year = precisionDate.year;
  const month = precisionDate.month
    ? String(precisionDate.month).padStart(2, "0")
    : "01";
  const day = precisionDate.day
    ? String(precisionDate.day).padStart(2, "0")
    : "01";

  return `${year}-${month}-${day}`;
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
