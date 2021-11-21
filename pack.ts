import * as coda from "@codahq/packs-sdk";
import * as helpers from "./helpers";
import * as schemas from "./schemas";

export const pack = coda.newPack({ version: "1.0" });

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */

// We're using https://imdb-api.com, which has a weird structure in which the api key
// must be inserted into the URL path. To do this, we use custom authentication:
//

pack.addNetworkDomain("imdb-api.com");
pack.setUserAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [{ name: "apiKey", description: "API Key from imdb-api.com" }],
  instructionsUrl: "https://coda.io/@nickhe/imdb-pack",
});

/* -------------------------------------------------------------------------- */
/*                               Column Formats                               */
/* -------------------------------------------------------------------------- */

pack.addColumnFormat({
  name: "IMDB Movie",
  instructions: "Shows movie details from IMDB",
  formulaName: "IMDBMovie",
  formulaNamespace: "Deprecated",
});

/* -------------------------------------------------------------------------- */
/*                                  Formulas                                  */
/* -------------------------------------------------------------------------- */

pack.addFormula({
  name: "IMDBMovie",
  description: "Search for a movie title and get details about it from IMDB",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "query",
      description: "Search IMDB (try movie name, or movie name and year)",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.MovieSchema,

  execute: async function ([query], context) {
    return helpers.getMovie(context, query);
  },
});
