import * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                           Smaller Object Schemas                           */
/* -------------------------------------------------------------------------- */

export const WatchProviderSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {
      type: coda.ValueType.String,
    },
    country: {
      type: coda.ValueType.String,
    },
  },
  primary: "name",
  identity: {
    name: "WatchProvider",
    attribution: [
      {
        type: coda.AttributionNodeType.Text,
        text: "Data by ",
      },
      {
        type: coda.AttributionNodeType.Link,
        anchorText: "JustWatch",
        anchorUrl: "https://www.justwatch.com/",
      },
      {
        type: coda.AttributionNodeType.Image,
        imageUrl: "https://www.justwatch.com/appassets/favicon.ico",
        anchorUrl: "https://www.justwatch.com/",
      },
    ],
  },
});

/* -------------------------------------------------------------------------- */
/*                           Formula Object Schemas                           */
/* -------------------------------------------------------------------------- */

export const MovieSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    Title: { type: coda.ValueType.String },
    HorizontalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Year: { type: coda.ValueType.Number },
    Runtime: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Duration,
    },
    Director: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
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
      items: WatchProviderSchema,
    },
    Buy: {
      type: coda.ValueType.Array,
      items: WatchProviderSchema,
    },
    Rent: {
      type: coda.ValueType.Array,
      items: WatchProviderSchema,
    },
    ImdbRating: { type: coda.ValueType.Number },
    Metacritic: { type: coda.ValueType.Number },
    RottenTomatoes: { type: coda.ValueType.Number },
    VerticalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
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
    ImdbId: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
  },
  primary: "Title",
  featured: ["Title", "Year", "HorizontalPoster"],
  id: "ImdbId",
  identity: {
    name: "Movie",
    attribution: [
      {
        type: coda.AttributionNodeType.Text,
        text: "Movie data from IMDb and The Movie Database. Streaming provider data from JustWatch.",
      },
    ],
  },
});
