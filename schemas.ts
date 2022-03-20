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

export const PersonSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    Name: {
      type: coda.ValueType.String,
    },
    Photo: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    ImdbLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    ImdbId: {
      type: coda.ValueType.String,
    },
  },
  primary: "Name",
  identity: {
    name: "Person",
    attribution: [
      {
        type: coda.AttributionNodeType.Text,
        text: "Data from ",
      },
      {
        type: coda.AttributionNodeType.Link,
        anchorText: "IMDb",
        anchorUrl: "https://imdb.com/",
      },
      {
        type: coda.AttributionNodeType.Image,
        imageUrl:
          "https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png",
        anchorUrl: "https://imdb.com/",
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
      items: PersonSchema,
    },
    Writer: {
      type: coda.ValueType.Array,
      items: PersonSchema,
    },
    Starring: {
      type: coda.ValueType.Array,
      items: PersonSchema,
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
    TrailerLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    ImdbRating: { type: coda.ValueType.Number },
    Metacritic: { type: coda.ValueType.Number },
    RottenTomatoes: { type: coda.ValueType.Number },
    VerticalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Plot: {
      type: coda.ValueType.String,
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
    BoxOffice: {
      type: coda.ValueType.Object,
      properties: {
        Budget: {
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Currency,
        },
        USAGross: {
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Currency,
        },
        USAOpeningWeekend: {
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Currency,
        },
        GlobalGross: {
          type: coda.ValueType.Number,
          codaType: coda.ValueHintType.Currency,
        },
      },
      primary: "GlobalGross",
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

export const SeriesSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    Title: { type: coda.ValueType.String },
    FullTitle: { type: coda.ValueType.String },
    HorizontalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Years: {
      type: coda.ValueType.Object,
      properties: {
        Years: { type: coda.ValueType.String },
        StartYear: { type: coda.ValueType.String },
        EndYear: { type: coda.ValueType.String },
      },
      primary: "Years",
    },
    Creators: {
      type: coda.ValueType.Array,
      items: PersonSchema,
    },
    Starring: {
      type: coda.ValueType.Array,
      items: PersonSchema,
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
    TrailerLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    ContentRating: { type: coda.ValueType.String },
    ImdbRating: { type: coda.ValueType.Number },
    Metacritic: { type: coda.ValueType.Number },
    RottenTomatoes: { type: coda.ValueType.Number },
    VerticalPoster: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Plot: { type: coda.ValueType.String },
    Genres: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Companies: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Networks: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Countries: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    Seasons: {
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          SeasonName: { type: coda.ValueType.String },
          SeasonNumber: { type: coda.ValueType.Number },
          EpisodeCount: { type: coda.ValueType.Number },
          AirDate: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.Date,
          },
        },
        primary: "SeasonName",
        id: "SeasonNumber",
      },
    },
    NextEpisodeAirDate: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    Status: { type: coda.ValueType.String },
    ImdbId: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
  },
});
