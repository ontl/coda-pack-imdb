import * as coda from "@codahq/packs-sdk";

/*
 * Schemas for your formulas and sync tables go here, for example:
 */

export const MovieSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    Title: { type: coda.ValueType.String },
    Year: { type: coda.ValueType.Number },
    Runtime: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
      // fromKey: "runningTimeInMinutes",
    },
    Poster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      // fromKey: "image.url",
    },
    IMDBId: { type: coda.ValueType.String },
  },
  primary: "Title",
  featured: ["Title", "Year", "Poster"],
  id: "IMDBId",
  // identity: {name: "IMDBMovie"}
});
