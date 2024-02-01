import * as coda from "@codahq/packs-sdk";
import * as helpers from "./helpers";
import * as schemas from "./schemas";

export const pack = coda.newPack();

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */

// Normally we could set up an easier authentication type (e.g. HeaderBearerToken),
// but we're using two different endpoints with their own authentication. The best
// way to handle this is to use the custom authentication type, which lets you
// gather credentials from the user (or in this case the server) and then insert
// them into requests wherever is appropriate.

pack.addNetworkDomain("tv-api.com");
pack.addNetworkDomain("themoviedb.org");
pack.setSystemAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    { name: "imdbApiKey", description: "API Key from tv-api.com" },
    { name: "tmdbApiKey", description: "API Key from themoviedb.org" },
  ],
});

/* -------------------------------------------------------------------------- */
/*                               Column Formats                               */
/* -------------------------------------------------------------------------- */

pack.addColumnFormat({
  name: "Movie",
  instructions:
    "Shows movie details from IMDB (put title, title and year, or IMDB ID in column)",
  formulaName: "Movie",
});

pack.addColumnFormat({
  name: "Series",
  instructions:
    "Shows TV series details from IMDB (put show name or IMDB ID in column)",
  formulaName: "Series",
});

pack.addColumnFormat({
  name: "Person",
  instructions:
    "Shows person details from IMDB (put name or IMDB ID in column)",
  formulaName: "Person",
});

/* -------------------------------------------------------------------------- */
/*                                  Formulas                                  */
/* -------------------------------------------------------------------------- */

pack.addFormula({
  name: "Movie",
  description: "Search for a movie title to retrieve all its details",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "Search IMDB (try movie title, or movie title and year)",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "streamingCountry",
      description:
        "2-letter code for your country, to show which of your streaming providers have this movie (e.g. 'US', 'CA', 'UK')",
      optional: true,
      autocomplete: async function (context, search) {
        return helpers.autocompleteCountryCode(context, search);
      },
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: schemas.MovieSchema,
  execute: async function ([title, country], context) {
    return helpers.getMovie(context, title, country);
  },
});

pack.addFormula({
  name: "Series",
  description: "Search for a TV series title to retrieve all its details",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "title",
      description: "Search IMDB (try series title, or series title and year)",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "streamingCountry",
      description:
        "2-letter code for your country, to show which of your streaming providers have this series (e.g. 'US', 'CA', 'UK')",
      optional: true,
      autocomplete: async function (context, search) {
        return helpers.autocompleteCountryCode(context, search);
      },
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: schemas.SeriesSchema,
  execute: async function ([title, country], context) {
    return helpers.getSeries(context, title, country);
  },
});

pack.addFormula({
  name: "Person",
  description:
    "Search for a person (actor, producer, foley artist) to retrieve all their details.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description:
        "Search IMDB (try person's name, or their IMDB ID beginning with 'nm')",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: schemas.PersonSchema,
  execute: async function ([name], context) {
    return helpers.getPerson(context, name);
  },
});
