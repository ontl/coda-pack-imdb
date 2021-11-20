import * as coda from "@codahq/packs-sdk";
import * as helpers from "./helpers";
import * as schemas from "./schemas";

export const pack = coda.newPack({ version: "0.1.0" });

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */

pack.addNetworkDomain("rapidapi.com");
pack.setUserAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "x-rapidapi-key",
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
