import * as coda from "@codahq/packs-sdk";

/*
 * Schemas for your formulas and sync tables go here, for example:
 */

export const MovieSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    IMDBId: { type: coda.ValueType.String },
    Title: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
    Year: { type: coda.ValueType.Number },
    Runtime: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    Poster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Rating: { type: coda.ValueType.Number },
    Metacritic: { type: coda.ValueType.Number },
    RottenTomatoes: { type: coda.ValueType.Number },
    Link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    Director: { type: coda.ValueType.String },
    Writer: { type: coda.ValueType.String },
    Starring: { type: coda.ValueType.String },
  },
  primary: "Title",
  featured: ["Title", "Year", "Poster"],
  id: "IMDBId",
  // identity: {name: "IMDBMovie"}
});
