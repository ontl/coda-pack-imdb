import * as coda from "@codahq/packs-sdk";

/*
 * Schemas for your formulas and sync tables go here, for example:
 */

export const MovieSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    ImdbId: { type: coda.ValueType.String },
    Title: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
    Year: { type: coda.ValueType.Number },
    Runtime: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    Poster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageAttachment,
    },
    VerticalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageAttachment,
    },
    Rating: { type: coda.ValueType.Number },
    Metacritic: { type: coda.ValueType.Number },
    RottenTomatoes: { type: coda.ValueType.Number },
    ImdbLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    WatchLinks: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    Stream: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    },
    Buy: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    },
    Rent: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    },
    Director: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Writer: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Starring: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Genres: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Countries: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Companies: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
  },
  primary: "Title",
  featured: ["Title", "Year", "Poster"],
  id: "ImdbId",
  identity: { name: "Movie" },
});
