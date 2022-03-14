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

pack.addNetworkDomain("imdb-api.com");
pack.addNetworkDomain("themoviedb.org");
pack.setSystemAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    { name: "imdbApiKey", description: "API Key from imdb-api.com" },
    { name: "tmdbApiKey", description: "API Key from themoviedb.org" },
  ],
});

/* -------------------------------------------------------------------------- */
/*                               Column Formats                               */
/* -------------------------------------------------------------------------- */

pack.addColumnFormat({
  name: "Movie",
  instructions: "Shows movie details from IMDB",
  formulaName: "Movie",
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
      // TODO: Autocomplete with a list of countries, perhaps showing their names
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: schemas.MovieSchema,
  execute: async function ([title, country], context) {
    return helpers.getMovie(context, title, country);
  },
});
