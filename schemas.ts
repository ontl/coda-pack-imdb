import * as coda from "@codahq/packs-sdk";

/* -------------------------------------------------------------------------- */
/*                                Attributions                                */
/* -------------------------------------------------------------------------- */

const attributionImdb: coda.AttributionNode[] = [
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
];

const attributionGeneric: coda.AttributionNode[] = [
  {
    type: coda.AttributionNodeType.Text,
    text: "Movie data from IMDb and The Movie Database. Streaming provider data from JustWatch.",
  },
];

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
  displayProperty: "name",
  identityName: "WatchProvider",
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
});

export const PersonSchemaMini = coda.makeObjectSchema({
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
  displayProperty: "Name",
  attribution: attributionImdb,
  identityName: "Person",
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
      items: PersonSchemaMini,
    },
    Writer: {
      type: coda.ValueType.Array,
      items: PersonSchemaMini,
    },
    Starring: {
      type: coda.ValueType.Array,
      items: PersonSchemaMini,
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
    ContentRating: { type: coda.ValueType.String },
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
      displayProperty: "GlobalGross",
    },
    ImdbId: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
  },
  displayProperty: "Title",
  featuredProperties: ["Title", "Year", "HorizontalPoster"],
  idProperty: "ImdbId",
  identityName: "Movie",
  attribution: attributionGeneric,
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
      displayProperty: "Years",
    },
    Creators: {
      type: coda.ValueType.Array,
      items: PersonSchemaMini,
    },
    Starring: {
      type: coda.ValueType.Array,
      items: PersonSchemaMini,
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
        displayProperty: "SeasonName",
        idProperty: "SeasonNumber",
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
  displayProperty: "Title",
  featuredProperties: ["Title", "Years", "HorizontalPoster"],
  idProperty: "ImdbId",
  identityName: "Movie",
  attribution: attributionGeneric,
});

export const PersonSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    Name: { type: coda.ValueType.String },
    Description: { type: coda.ValueType.String },
    Photo: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    Roles: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    KnownFor: {
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          Summary: { type: coda.ValueType.String },
          Title: { type: coda.ValueType.String },
          Role: { type: coda.ValueType.String },
          Year: { type: coda.ValueType.String },
          ImdbId: { type: coda.ValueType.String },
          ImdbLink: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.Url,
          },
          Poster: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.ImageReference,
          },
        },
      },
      identity: {
        name: "KnownFor",
        attribution: attributionGeneric,
      },
    },
    Bio: { type: coda.ValueType.String },
    BirthDate: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    DeathDate: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    Age: { type: coda.ValueType.Number },
    Height: { type: coda.ValueType.String },
    Awards: { type: coda.ValueType.String },
    ImdbLink: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    ImdbId: { type: coda.ValueType.String },
  },
  displayProperty: "Name",
  featuredProperties: ["Description", "Photo"],
  idProperty: "ImdbId",
  identityName: "Person",
  attribution: attributionImdb,
});

// /Search endpoint
// "searchType": "Name",
// "expression": "Jean Reno",
// "results": [
//   {
//     "id": "nm0000606",
//     "resultType": "Name",
//     "image": "https://imdb-api.com/images/original/MV5BMTgzNjA1MjY2M15BMl5BanBnXkFtZTYwMjgzOTk0._V1_Ratio0.7273_AL_.jpg",
//     "title": "Jean Reno",
//     "description": "(I) (Actor, Léon: The Professional (1994))"
//   },
//
// Subsequent /SearchName endpoint
// {
//   "id": "nm0000606",
//   "name": "Jean Reno",
//   "role": "Actor",
//   "image": "https://imdb-api.com/images/original/MV5BMTgzNjA1MjY2M15BMl5BanBnXkFtZTYwMjgzOTk0._V1_Ratio0.6751_AL_.jpg",
//   "summary": "Jean Reno was born Juan Moreno y Herrera-Jiménez in Casablanca, Morocco, to Spanish parents (from Andalucía) who moved to North Africa to seek work. His father was a linotypist. Reno settled in France at 17. He began studying drama and has credits in French television and theater as well as films. His first two marriages both ended in divorce, and...",
//   "birthDate": "1948-07-30",
//   "deathDate": null,
//   "awards": "2 wins & 5 nominations.",
//   "height": "6' 1¾\" (1.87 m)",
//   "knownFor": [
//     {
//       "id": "tt0110413",
//       "title": "Léon: The Professional",
//       "fullTitle": "Léon: The Professional (1994)",
//       "year": "1994",
//       "role": "Leon",
//       "image": "https://imdb-api.com/images/original/MV5BODllNWE0MmEtYjUwZi00ZjY3LThmNmQtZjZlMjI2YTZjYmQ0XkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_Ratio0.6852_AL_.jpg"
//     },
//     {
//       "id": "tt0095250",
//       "title": "The Big Blue",
//       "fullTitle": "The Big Blue (1988)",
//       "year": "1988",
//       "role": "Enzo Molinari",
//       "image": "https://imdb-api.com/images/original/MV5BOTg5NGE1MjYtZjU3Zi00NWZhLTg4ZmEtMDI0YzMwN2Y2NDIxXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_Ratio0.7130_AL_.jpg"
//     },
//     {
//       "id": "tt0122690",
//       "title": "Ronin",
//       "fullTitle": "Ronin (1998)",
//       "year": "1998",
//       "role": "Vincent",
//       "image": "https://imdb-api.com/images/original/MV5BOWVkYzliZGEtODIxMi00MDQwLThjMDAtNzI3M2NjYjg4NDE5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_Ratio0.6852_AL_.jpg"
//     },
//     {
//       "id": "tt0383216",
//       "title": "The Pink Panther",
//       "fullTitle": "The Pink Panther (2006)",
//       "year": "2006",
//       "role": "Ponton",
//       "image": "https://imdb-api.com/images/original/MV5BNGI2MjVlNzEtZDg1ZS00MGU1LWFhNTQtNzMwZDViOWRkNzhkXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_Ratio0.6852_AL_.jpg"
//     }
//   ],
//   "castMovies": [
//     {
//       "id": "tt7984890",
//       "role": "Actor",
//       "title": "The Man Who Saved Paris",
//       "year": "",
//       "description": "(pre-production) Trenet"
//     },
//     {
//       "id": "tt10698534",
//       "role": "Actor",
//       "title": "A Private Affair",
//       "year": "2022",
//       "description": "(TV Series) (post-production) Héctor - Episode #1.8 (2022) ... Héctor - Episode #1.7 (2022) ... Héctor - Episode #1.5 (2022) ... Héctor - Episode #1.6 (2022) ... Héctor - Episode #1.4 (2022) ... Héctor Show all 8 episodes"
//     },
//     {
//       "id": "tt10042788",
//       "role": "Actor",
//       "title": "Promises",
//       "year": "2021/IV",
//       "description": "Grandpa"
//     },
//     {
//       "id": "tt14677314",
//       "role": "Actor",
//       "title": "All Those Things We Never Said",
//       "year": "2020",
//       "description": "(TV Series)"
//     },
//     {
//       "id": "tt11695414",
//       "role": "Actor",
//       "title": "I Love You Coiffure",
//       "year": "2020",
//       "description": "(TV Movie) Le mari de Maud"
//     },
//     {
//       "id": "tt4277922",
//       "role": "Actor",
//       "title": "Call My Agent!",
//       "year": "2020",
//       "description": "(TV Series) Jean Reno - Jean (2020) ... Jean Reno"
//     },
//     {
//       "id": "tt10127684",
//       "role": "Actor",
//       "title": "Rogue City",
//       "year": "2020",
//       "description": "Ange / Divisional Commissioner"
//     },
//     {
//       "id": "tt6222118",
//       "role": "Actor",
//       "title": "The Doorman",
//       "year": "2020",
//       "description": "Victor Dubois"
//     },
//     {
//       "id": "tt6435934",
//       "role": "Actor",
//       "title": "The Last Journey",
//       "year": "2020",
//       "description": "Henri W.R"
//     },
//     {
//       "id": "tt10726424",
//       "role": "Actor",
//       "title": "Die Hart",
//       "year": "2020",
//       "description": "(TV Series) Claude Van De Velde - Sex, Lies and Videotape (2020) ... Claude Van De Velde - Man on Fire (2020) ... Claude Van De Velde (credit only) - True Lies (2020) ... Claude Van De Velde - Live Free or Die Hard (2020) ... Claude Van De Velde (credit only) - Bad Boys (2020) ... Claude Van De Velde (credit only) Show all 10 episodes"
//     },
//     {
//       "id": "tt9777644",
//       "role": "Actor",
//       "title": "Da 5 Bloods",
//       "year": "2020",
//       "description": "Desroche"
//     },
//     {
//       "id": "tt7095476",
//       "role": "Actor",
//       "title": "Waiting for Anya",
//       "year": "2020",
//       "description": "Grand-Pére"
//     },
//     {
//       "id": "tt5191094",
//       "role": "Actor",
//       "title": "A Magical Journey",
//       "year": "2019",
//       "description": "Screen Hologram"
//     },
//     {
//       "id": "tt9082020",
//       "role": "Actor",
//       "title": "Cold Blood",
//       "year": "2019",
//       "description": "Henry"
//     },
//     {
//       "id": "tt8242160",
//       "role": "Actor",
//       "title": "4L",
//       "year": "2019",
//       "description": "Jean Pierre"
//     },
//     {
//       "id": "tt6892400",
//       "role": "Actor",
//       "title": "The Girl in the Fog",
//       "year": "2017",
//       "description": "Augusto Flores"
//     },
//     {
//       "id": "tt5866930",
//       "role": "Actor",
//       "title": "The Adventurers",
//       "year": "2017",
//       "description": "Pierre Bissette"
//     },
//     {
//       "id": "tt5286268",
//       "role": "Actor",
//       "title": "Family Heist",
//       "year": "2017",
//       "description": "Patrick"
//     },
//     {
//       "id": "tt4776998",
//       "role": "Actor",
//       "title": "The Promise",
//       "year": "2016/II",
//       "description": "Admiral Fournet"
//     },
//     {
//       "id": "tt5770284",
//       "role": "Actor",
//       "title": "The Little Things",
//       "year": "2016",
//       "description": "(Short) Jean-Pierre Bertrand"
//     },
//     {
//       "id": "tt3286560",
//       "role": "Actor",
//       "title": "The Last Face",
//       "year": "2016",
//       "description": "Dr. Mehmet Love"
//     },
//     {
//       "id": "tt2441982",
//       "role": "Actor",
//       "title": "The Visitors: Bastille Day",
//       "year": "2016",
//       "description": "Godefroy le Hardi"
//     },
//     {
//       "id": "tt3532278",
//       "role": "Actor",
//       "title": "Brothers of the Wind",
//       "year": "2015",
//       "description": "Danzer"
//     },
//     {
//       "id": "tt4232610",
//       "role": "Actor",
//       "title": "The Squad",
//       "year": "2015",
//       "description": "Serge Buren"
//     },
//     {
//       "id": "tt2800356",
//       "role": "Actor",
//       "title": "Benedict Ironbreaker: The Red Taxis",
//       "year": "2014",
//       "description": "Poilonez"
//     },
//     {
//       "id": "tt1626146",
//       "role": "Actor",
//       "title": "Hector and the Search for Happiness",
//       "year": "2014",
//       "description": "Diego Baresco"
//     },
//     {
//       "id": "tt3013588",
//       "role": "Actor",
//       "title": "My Summer in Provence",
//       "year": "2014",
//       "description": "Paul"
//     },
//     {
//       "id": "tt2359381",
//       "role": "Actor",
//       "title": "Days and Nights",
//       "year": "2014",
//       "description": "Louis"
//     },
//     {
//       "id": "tt2476706",
//       "role": "Actor",
//       "title": "Jo",
//       "year": "2013",
//       "description": "(TV Mini Series) Jo St-Clair - The Catacombes (2013) ... Jo St-Clair - The Opera (2013) ... Jo St-Clair - Le Marais (2013) ... Jo St-Clair - Place Vendôme (2013) ... Jo St-Clair - Invalides (2013) ... Jo St-Clair Show all 8 episodes"
//     },
//     {
//       "id": "tt1712170",
//       "role": "Actor",
//       "title": "Alex Cross",
//       "year": "2012",
//       "description": "Giles Mercier"
//     },
//     {
//       "id": "tt1891845",
//       "role": "Actor",
//       "title": "The Day of the Crows",
//       "year": "2012",
//       "description": "Le père Courge (voice)"
//     },
//     {
//       "id": "tt1850394",
//       "role": "Actor",
//       "title": "The Dream Team",
//       "year": "2012",
//       "description": "Jean Reno"
//     },
//     {
//       "id": "tt1911553",
//       "role": "Actor",
//       "title": "The Chef",
//       "year": "2012",
//       "description": "Alexandre Lagarde"
//     },
//     {
//       "id": "tt1726889",
//       "role": "Actor",
//       "title": "You Don't Choose Your Family",
//       "year": "2011",
//       "description": "Docteur Luix"
//     },
//     {
//       "id": "tt0466893",
//       "role": "Actor",
//       "title": "Margaret",
//       "year": "2011/I",
//       "description": "Ramon"
//     },
//     {
//       "id": "tt1756819",
//       "role": "Actor",
//       "title": "The Philosopher",
//       "year": "2010",
//       "description": "(Short) Baggio"
//     },
//     {
//       "id": "tt1167638",
//       "role": "Actor",
//       "title": "22 Bullets",
//       "year": "2010",
//       "description": "Charly Matteï"
//     },
//     {
//       "id": "tt1382725",
//       "role": "Actor",
//       "title": "The Roundup",
//       "year": "2010",
//       "description": "Dr. David Scheinbaum"
//     },
//     {
//       "id": "tt0913354",
//       "role": "Actor",
//       "title": "Armored",
//       "year": "2009",
//       "description": "Quinn"
//     },
//     {
//       "id": "tt1078940",
//       "role": "Actor",
//       "title": "Couples Retreat",
//       "year": "2009",
//       "description": "Marcel"
//     },
//     {
//       "id": "tt1130993",
//       "role": "Actor",
//       "title": "Ultimate Heist",
//       "year": "2009",
//       "description": "Milo Malakian"
//     },
//     {
//       "id": "tt0838232",
//       "role": "Actor",
//       "title": "The Pink Panther 2",
//       "year": "2009",
//       "description": "Ponton"
//     },
//     {
//       "id": "tt1002966",
//       "role": "Actor",
//       "title": "Cash",
//       "year": "2008",
//       "description": "Maxime - Dubreuil"
//     },
//     {
//       "id": "tt1089679",
//       "role": "Actor",
//       "title": "The Great Occasions",
//       "year": "2006",
//       "description": "(TV Movie) Antoine"
//     },
//     {
//       "id": "tt0424095",
//       "role": "Actor",
//       "title": "Flushed Away",
//       "year": "2006",
//       "description": "Le Frog (voice)"
//     },
//     {
//       "id": "tt0454824",
//       "role": "Actor",
//       "title": "Flyboys",
//       "year": "2006",
//       "description": "Capt. Thenault"
//     },
//     {
//       "id": "tt0382625",
//       "role": "Actor",
//       "title": "The Da Vinci Code",
//       "year": "2006",
//       "description": "Captain Bezu Fache"
//     },
//     {
//       "id": "tt0383216",
//       "role": "Actor",
//       "title": "The Pink Panther",
//       "year": "2006",
//       "description": "Ponton"
//     },
//     {
//       "id": "tt0419198",
//       "role": "Actor",
//       "title": "The Tiger and the Snow",
//       "year": "2005",
//       "description": "Fuad"
//     },
//     {
//       "id": "tt0402158",
//       "role": "Actor",
//       "title": "Empire of the Wolves",
//       "year": "2005",
//       "description": "Jean-Louis Schiffer"
//     },
//     {
//       "id": "tt0380349",
//       "role": "Actor",
//       "title": "The Corsican File",
//       "year": "2004",
//       "description": "Ange Leoni"
//     },
//     {
//       "id": "tt0395169",
//       "role": "Actor",
//       "title": "Hotel Rwanda",
//       "year": "2004",
//       "description": "Mr. Tillens - Sabena Airlines President (uncredited)"
//     },
//     {
//       "id": "tt0363858",
//       "role": "Actor",
//       "title": "Onimusha 3: Demon Siege",
//       "year": "2004",
//       "description": "(Video Game) Jacques Blanc (French) (voice)"
//     },
//     {
//       "id": "tt0337103",
//       "role": "Actor",
//       "title": "Crimson Rivers 2: Angels of the Apocalypse",
//       "year": "2004",
//       "description": "Pierre Niemans"
//     },
//     {
//       "id": "tt0310203",
//       "role": "Actor",
//       "title": "Ruby & Quentin",
//       "year": "2003",
//       "description": "Ruby"
//     },
//     {
//       "id": "tt13318492",
//       "role": "Actor",
//       "title": "The Lion King Read-Along",
//       "year": "2003",
//       "description": "(Video short) Mufasa"
//     },
//     {
//       "id": "tt0293116",
//       "role": "Actor",
//       "title": "Jet Lag",
//       "year": "2002",
//       "description": "Félix"
//     },
//     {
//       "id": "tt0246894",
//       "role": "Actor",
//       "title": "Rollerball",
//       "year": "2002",
//       "description": "Alexis Petrovich"
//     },
//     {
//       "id": "tt0281364",
//       "role": "Actor",
//       "title": "Wasabi",
//       "year": "2001",
//       "description": "Hubert Fiorentini"
//     },
//     {
//       "id": "tt0189192",
//       "role": "Actor",
//       "title": "Just Visiting",
//       "year": "2001",
//       "description": "Thibault"
//     },
//     {
//       "id": "tt0228786",
//       "role": "Actor",
//       "title": "The Crimson Rivers",
//       "year": "2000",
//       "description": "Pierre Niemans"
//     },
//     {
//       "id": "tt0122690",
//       "role": "Actor",
//       "title": "Ronin",
//       "year": "1998",
//       "description": "Vincent"
//     },
//     {
//       "id": "tt0120685",
//       "role": "Actor",
//       "title": "Godzilla",
//       "year": "1998/I",
//       "description": "Philippe Roaché"
//     },
//     {
//       "id": "tt0120882",
//       "role": "Actor",
//       "title": "The Visitors II: The Corridors of Time",
//       "year": "1998",
//       "description": "Comte Godefroy de Montmirail, dit Godefroy le Hardi"
//     },
//     {
//       "id": "tt0120156",
//       "role": "Actor",
//       "title": "The Sun Sisters",
//       "year": "1997",
//       "description": "Un spectateur"
//     },
//     {
//       "id": "tt0120404",
//       "role": "Actor",
//       "title": "A Witch's Way of Love",
//       "year": "1997",
//       "description": "Molok"
//     },
//     {
//       "id": "tt0120034",
//       "role": "Actor",
//       "title": "Roseanna's Grave",
//       "year": "1997",
//       "description": "Marcello"
//     },
//     {
//       "id": "tt0116676",
//       "role": "Actor",
//       "title": "The Jaguar",
//       "year": "1996",
//       "description": "Jean Campana"
//     },
//     {
//       "id": "tt0117060",
//       "role": "Actor",
//       "title": "Mission: Impossible",
//       "year": "1996",
//       "description": "Krieger"
//     },
//     {
//       "id": "tt0114086",
//       "role": "Actor",
//       "title": "Beyond the Clouds",
//       "year": "1995",
//       "description": "Carlo"
//     },
//     {
//       "id": "tt0113117",
//       "role": "Actor",
//       "title": "French Kiss",
//       "year": "1995",
//       "description": "Inspector Jean-Paul Cardon"
//     },
//     {
//       "id": "tt0114737",
//       "role": "Actor",
//       "title": "Truffles",
//       "year": "1995",
//       "description": "Patrick"
//     },
//     {
//       "id": "tt0110413",
//       "role": "Actor",
//       "title": "Léon: The Professional",
//       "year": "1994",
//       "description": "Leon"
//     },
//     {
//       "id": "tt0308701",
//       "role": "Actor",
//       "title": "Paranoia",
//       "year": "1993",
//       "description": "(Short)"
//     },
//     {
//       "id": "tt0108498",
//       "role": "Actor",
//       "title": "The Screw",
//       "year": "1993",
//       "description": "(Short) Monsieur K"
//     },
//     {
//       "id": "tt0106927",
//       "role": "Actor",
//       "title": "Der Preis der Freundschaft",
//       "year": "1993",
//       "description": "(TV Movie) Charlie Bert"
//     },
//     {
//       "id": "tt0108500",
//       "role": "Actor",
//       "title": "Les visiteurs",
//       "year": "1993",
//       "description": "Godefroy de Papincourt, Comte de Montmirail"
//     },
//     {
//       "id": "tt0102339",
//       "role": "Actor",
//       "title": "Loulou Graffiti",
//       "year": "1992",
//       "description": "Pique la Lune"
//     },
//     {
//       "id": "tt0100303",
//       "role": "Actor",
//       "title": "Operation Corned Beef",
//       "year": "1991",
//       "description": "Squale"
//     },
//     {
//       "id": "tt0099789",
//       "role": "Actor",
//       "title": "The Man in the Golden Mask",
//       "year": "1991",
//       "description": "Father Victorio Gaetano"
//     },
//     {
//       "id": "tt0100263",
//       "role": "Actor",
//       "title": "Nikita",
//       "year": "1990",
//       "description": "Victor nettoyeur"
//     },
//     {
//       "id": "tt0095250",
//       "role": "Actor",
//       "title": "The Big Blue",
//       "year": "1988",
//       "description": "Enzo Molinari"
//     },
//     {
//       "id": "tt0277160",
//       "role": "Actor",
//       "title": "Mr. Benjamin",
//       "year": "1987",
//       "description": "(TV Movie) Rommin"
//     },
//     {
//       "id": "tt0252420",
//       "role": "Actor",
//       "title": "Tomorrow the Day Will Come",
//       "year": "1986",
//       "description": "(TV Movie) Le déserteur"
//     },
//     {
//       "id": "tt0101019",
//       "role": "Actor",
//       "title": "Death Town",
//       "year": "1986",
//       "description": "Leccia"
//     },
//     {
//       "id": "tt0091244",
//       "role": "Actor",
//       "title": "I Love You",
//       "year": "1986",
//       "description": "Le dentiste"
//     },
//     {
//       "id": "tt0088626",
//       "role": "Actor",
//       "title": "Tender Is the Night",
//       "year": "1985",
//       "description": "(TV Mini Series) Dr. Dangen - 1928 (1985) ... Dr. Dangen"
//     },
//     {
//       "id": "tt0167732",
//       "role": "Actor",
//       "title": "Black Sequence",
//       "year": "1985",
//       "description": "(TV Series) Christiani - Pour venger Pépère (1985) ... Christiani"
//     },
//     {
//       "id": "tt0090090",
//       "role": "Actor",
//       "title": "Strictly Personal",
//       "year": "1985",
//       "description": "Detective Villechaize"
//     },
//     {
//       "id": "tt0090095",
//       "role": "Actor",
//       "title": "Subway",
//       "year": "1985",
//       "description": "Le Batteur"
//     },
//     {
//       "id": "tt0307611",
//       "role": "Actor",
//       "title": "A Fulfilled Man",
//       "year": "1985",
//       "description": "(TV Movie) Joël"
//     },
//     {
//       "id": "tt0090228",
//       "role": "Actor",
//       "title": "The Telephone Always Rings Twice",
//       "year": "1985",
//       "description": "L'homme de confiance de Marraine"
//     },
//     {
//       "id": "tt0358929",
//       "role": "Actor",
//       "title": "Alea",
//       "year": "1984",
//       "description": "(Short)"
//     },
//     {
//       "id": "tt0316308",
//       "role": "Actor",
//       "title": "Hold the Line",
//       "year": "1984",
//       "description": "(Short) Le policier"
//     },
//     {
//       "id": "tt0169412",
//       "role": "Actor",
//       "title": "Hello Beatrice",
//       "year": "1984",
//       "description": "(TV Series) Le directeur des Trépassés - Charmant week-end (1984) ... Le directeur des Trépassés"
//     },
//     {
//       "id": "tt0087818",
//       "role": "Actor",
//       "title": "Our History",
//       "year": "1984",
//       "description": "A neighbour"
//     },
//     {
//       "id": "tt0279670",
//       "role": "Actor",
//       "title": "Bloody Ballad",
//       "year": "1983",
//       "description": "(Short)"
//     },
//     {
//       "id": "tt0086311",
//       "role": "Actor",
//       "title": "Outward Signs of Wealth",
//       "year": "1983",
//       "description": "Marc Letellier"
//     },
//     {
//       "id": "tt0280299",
//       "role": "Actor",
//       "title": "A Few Men of Good Will",
//       "year": "1983",
//       "description": "(TV Mini Series)"
//     },
//     {
//       "id": "tt0085426",
//       "role": "Actor",
//       "title": "The Last Battle",
//       "year": "1983",
//       "description": "The Brute"
//     },
//     {
//       "id": "tt0084479",
//       "role": "Actor",
//       "title": "The Passerby",
//       "year": "1982",
//       "description": "Antisemit"
//     },
//     {
//       "id": "tt0082038",
//       "role": "Actor",
//       "title": "The Penultimate",
//       "year": "1981",
//       "description": "(Short)"
//     },
//     {
//       "id": "tt0083650",
//       "role": "Actor",
//       "title": "Les bidasses aux grandes manoeuvres",
//       "year": "1981",
//       "description": "Lieutenant Zag"
//     },
//     {
//       "id": "tt0082848",
//       "role": "Actor",
//       "title": "We're Not Angels... Neither Are They",
//       "year": "1981",
//       "description": "Le serveur restaurant chic (uncredited)"
//     },
//     {
//       "id": "tt0197140",
//       "role": "Actor",
//       "title": "Mail from the Sky",
//       "year": "1980",
//       "description": "(TV Mini Series) Moraglia"
//     },
//     {
//       "id": "tt0081728",
//       "role": "Actor",
//       "title": "Do You Want a Nobel Baby?",
//       "year": "1980",
//       "description": "Bernier"
//     },
//     {
//       "id": "tt0078978",
//       "role": "Actor",
//       "title": "Womanlight",
//       "year": "1979",
//       "description": "Le flic place de la Concorde"
//     },
//     {
//       "id": "tt0077707",
//       "role": "Actor",
//       "title": "The Hypothesis of the Stolen Painting",
//       "year": "1978",
//       "description": "Personnage des Tableaux"
//     },
//     {
//       "id": "tt0170916",
//       "role": "Actor",
//       "title": "One Mystery a Day",
//       "year": "1974",
//       "description": "(TV Series) Deuxième cycliste - La corniche d'Aigrelet (1974) ... Deuxième cycliste (as Jonathan Brun)"
//     },
//     {
//       "id": "tt8114972",
//       "role": "Thanks",
//       "title": "Bang! Bang!",
//       "year": "2016/II",
//       "description": "(Short) (thanks)"
//     },
//     {
//       "id": "tt0390699",
//       "role": "Self",
//       "title": "Días de cine",
//       "year": "2012-2019",
//       "description": "(TV Series) Self - Interviewee - Episode dated 1 March 2019 (2019) ... Self - Interviewee - Episode dated 6 December 2012 (2012) ... Self - Interviewee"
//     },
//     {
//       "id": "tt7833052",
//       "role": "Self",
//       "title": "Johnny, toute la musique qu'ils aiment",
//       "year": "2018",
//       "description": "(TV Movie documentary) Self"
//     },
//     {
//       "id": "tt9155800",
//       "role": "Self",
//       "title": "Che fuori tempo che fa",
//       "year": "2017",
//       "description": "(TV Series) Self - Episode dated 23 October 2017 (2017) ... Self"
//     },
//     {
//       "id": "tt0307787",
//       "role": "Self",
//       "title": "Na plovárne",
//       "year": "2017",
//       "description": "(TV Series) Self - Na plovárne s Jeanem Reno (2017) ... Self"
//     },
//     {
//       "id": "tt2190581",
//       "role": "Self",
//       "title": "C à vous",
//       "year": "2010-2017",
//       "description": "(TV Series) Self - Episode dated 2 January 2017 (2017) ... Self - Episode dated 17 June 2016 (2016) ... Self - Episode dated 31 March 2014 (2014) ... Self - Episode dated 5 March 2012 (2012) ... Self - Episode dated 7 November 2011 (2011) ... Self Show all 6 episodes"
//     },
//     {
//       "id": "tt4304220",
//       "role": "Self",
//       "title": "Le grand show",
//       "year": "2016",
//       "description": "(TV Series) Self - Le Grand Show fête le Cinéma (2016) ... Self"
//     },
//     {
//       "id": "tt0364157",
//       "role": "Self",
//       "title": "Les enfants de la télé",
//       "year": "1998-2016",
//       "description": "(TV Series) Self - Episode dated 5 April 2016 (2016) ... Self - Episode dated 18 February 2012 (2012) ... Self - Episode dated 24 January 2009 (2009) ... Self - Episode dated 18 April 2008 (2008) ... Self - Episode dated 7 October 2006 (2006) ... Self Show all 6 episodes"
//     },
//     {
//       "id": "tt0426701",
//       "role": "Self",
//       "title": "Le grand journal de Canal+",
//       "year": "2005-2016",
//       "description": "(TV Series documentary) Self - Episode dated 29 March 2016 (2016) ... Self - Episode dated 16 May 2015 (2015) ... Self - Episode dated 15 May 2015 (2015) ... Self - Episode dated 2 March 2009 (2009) ... Self - Episode dated 10 February 2009 (2009) ... Self Show all 12 episodes"
//     },
//     {
//       "id": "tt2230619",
//       "role": "Self",
//       "title": "Terra Mater",
//       "year": "2016",
//       "description": "(TV Series documentary) Self - Making of \"Wie Brüder im Wind\" (2016) ... Self"
//     },
//     {
//       "id": "tt0251525",
//       "role": "Self",
//       "title": "Qui veut gagner des millions?",
//       "year": "2015",
//       "description": "(TV Series) Self - Episode dated 17 April 2015 (2015) ... Self"
//     },
//     {
//       "id": "tt0461732",
//       "role": "Self",
//       "title": "Vivement dimanche prochain",
//       "year": "1998-2015",
//       "description": "(TV Series) Self / Self - Main Guest - Episode dated 25 January 2015 (2015) ... Self - Episode dated 26 February 2012 (2012) ... Self - Episode dated 28 March 2010 (2010) ... Self - Episode dated 20 April 2008 (2008) ... Self - Episode dated 15 February 2004 (2004) ... Self Show all 8 episodes"
//     },
//     {
//       "id": "tt0985074",
//       "role": "Self",
//       "title": "Salut les Terriens",
//       "year": "2015",
//       "description": "(TV Series) Self - Episode dated 10 January 2015 (2015) ... Self"
//     },
//     {
//       "id": "tt4039504",
//       "role": "Self",
//       "title": "Paris Story",
//       "year": "2014",
//       "description": "(Documentary) Narrator (voice)"
//     },
//     {
//       "id": "tt2499756",
//       "role": "Self",
//       "title": "La parenthèse inattendue",
//       "year": "2014",
//       "description": "(TV Series) Self - Episode dated 2 April 2014 (2014) ... Self"
//     },
//     {
//       "id": "tt2878232",
//       "role": "Self",
//       "title": "Touche pas à mon poste!",
//       "year": "2014",
//       "description": "(TV Series) Self - Episode dated 1 April 2014 (2014) ... Self"
//     },
//     {
//       "id": "tt0461733",
//       "role": "Self",
//       "title": "Vivement dimanche",
//       "year": "2000-2014",
//       "description": "(TV Series) Self / Self - Main Guest - Jean Reno 3 (2014) ... Self - Main Guest - Spécial duos Champs-Elysees (2012) ... Self - Christian Clavier 4 (2011) ... Self - Episode dated 31 October 2010 (2010) ... Self - Jean Reno 2 (2010) ... Self - Main Guest Show all 16 episodes"
//     },
//     {
//       "id": "tt0870872",
//       "role": "Self",
//       "title": "El hormiguero",
//       "year": "2009-2013",
//       "description": "(TV Series) Self - Guest - Miguel Bosé (2013) ... Self - Guest - Episode dated 26 November 2012 (2012) ... Self - Guest - Episode dated 11 February 2009 (2009) ... Self - Guest"
//     },
//     {
//       "id": "tt0437729",
//       "role": "Self",
//       "title": "The Late Late Show with Craig Ferguson",
//       "year": "2006-2011",
//       "description": "(TV Series) Self - Guest - Episode #7.210 (2011) ... Self - Guest - Episode #7.209 (2011) ... Self - Guest - Episode #7.208 (2011) ... Self - Guest - Episode #7.207 (2011) ... Self - Guest - Episode #7.206 (2011) ... Self - Guest Show all 8 episodes"
//     },
//     {
//       "id": "tt6282514",
//       "role": "Self",
//       "title": "The Role That Changed My Life",
//       "year": "2011",
//       "description": "(TV Series documentary) Self - I Was a Ruthless Killer (2011) ... Self"
//     },
//     {
//       "id": "tt0353048",
//       "role": "Self",
//       "title": "Champs-Elysées",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 13 October 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt0431577",
//       "role": "Self",
//       "title": "Tout le monde en parle",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode #7.2 (2010) ... Self"
//     },
//     {
//       "id": "tt4573832",
//       "role": "Self",
//       "title": "The Spirit of Navigation",
//       "year": "2010",
//       "description": "(Short) Self"
//     },
//     {
//       "id": "tt5950650",
//       "role": "Self",
//       "title": "Ça va s'Cauet",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 25 March 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt5123584",
//       "role": "Self",
//       "title": "Rencontres de cinéma",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 21 March 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt1503022",
//       "role": "Self",
//       "title": "Cinémas",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 20 March 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt0435947",
//       "role": "Self",
//       "title": "Les 100 plus grands...",
//       "year": "2009-2010",
//       "description": "(TV Series) Self - Perles du direct (2010) ... Self - Bêtisiers politiques (2009) ... Self"
//     },
//     {
//       "id": "tt0872057",
//       "role": "Self",
//       "title": "On n'est pas couché",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 20 March 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt0872041",
//       "role": "Self",
//       "title": "Ce soir (ou jamais!)",
//       "year": "2010",
//       "description": "(TV Series) Self - Episode dated 17 March 2010 (2010) ... Self"
//     },
//     {
//       "id": "tt0375439",
//       "role": "Self",
//       "title": "Sacrée soirée",
//       "year": "1991-2009",
//       "description": "(TV Series) Self - Episode dated 16 December 2009 (2009) ... Self - Episode dated 6 October 1993 (1993) ... Self - Episode dated 20 January 1993 (1993) ... Self - Episode dated 1 April 1992 (1992) ... Self - Episode dated 30 January 1991 (1991) ... Self"
//     },
//     {
//       "id": "tt15441870",
//       "role": "Self",
//       "title": "MTV Europe Music Awards",
//       "year": "2000-2009",
//       "description": "(TV Series) Self - Presenter - MTV Europe Music Awards 2009 (2009) ... Self - Presenter - Stockholm 2000 (2000) ... Self - Presenter (uncredited)"
//     },
//     {
//       "id": "tt9053266",
//       "role": "Self",
//       "title": "La Légende de Johnny",
//       "year": "2009",
//       "description": "(TV Movie documentary) Self"
//     },
//     {
//       "id": "tt1403097",
//       "role": "Self",
//       "title": "Eine Filmreise ins Begehren",
//       "year": "2009",
//       "description": "(Documentary) Self"
//     },
//     {
//       "id": "tt0111920",
//       "role": "Self",
//       "title": "Cinema 3",
//       "year": "2009",
//       "description": "(TV Series) Self - Interviewee - Episode dated 28 February 2009 (2009) ... Self - Interviewee"
//     },
//     {
//       "id": "tt0488067",
//       "role": "Self",
//       "title": "L'hebdo cinéma",
//       "year": "2009",
//       "description": "(TV Series documentary) Self - Episode dated 21 February 2009 (2009) ... Self"
//     },
//     {
//       "id": "tt6581590",
//       "role": "Self",
//       "title": "Cannes Film Festival",
//       "year": "1998-2008",
//       "description": "(TV Series) Self - Cérémonie de clôture du 61ème Festival international du film de Cannes (2008) ... Self - Cérémonie de clôture du 51ème festival de Cannes (1998) ... Self"
//     },
//     {
//       "id": "tt1098241",
//       "role": "Self",
//       "title": "Extérieur jour",
//       "year": "2008",
//       "description": "(TV Series) Self - Episode dated 12 April 2008 (2008) ... Self"
//     },
//     {
//       "id": "tt1025537",
//       "role": "Self",
//       "title": "Glanz & Gloria",
//       "year": "2008",
//       "description": "(TV Series documentary) Self - Episode dated 9 April 2008 (2008) ... Self"
//     },
//     {
//       "id": "tt1144430",
//       "role": "Self",
//       "title": "Clavier-Poiré: Pour l'amour du rire",
//       "year": "2007",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt6704166",
//       "role": "Self",
//       "title": "Esprits libres",
//       "year": "2006",
//       "description": "(TV Series) Self - Episode dated 15 December 2006 (2006) ... Self"
//     },
//     {
//       "id": "tt5233148",
//       "role": "Self",
//       "title": "The Da Vinci Code: Close-Up on the Mona Lisa",
//       "year": "2006",
//       "description": "(Video short) Self"
//     },
//     {
//       "id": "tt5233156",
//       "role": "Self",
//       "title": "The Da Vinci Code: Filmmaker's Journey",
//       "year": "2006",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt5232932",
//       "role": "Self",
//       "title": "The Da Vinci Code: Unusual Suspects",
//       "year": "2006",
//       "description": "(Video short) Self"
//     },
//     {
//       "id": "tt0318220",
//       "role": "Self",
//       "title": "HBO First Look",
//       "year": "1994-2006",
//       "description": "(TV Series documentary short) Self - Down the Loo... The Making of 'Flushed Away' (2006) ... Self - The Best Man for the Job: The Making of 'The Professional' (1994) ... Self"
//     },
//     {
//       "id": "tt0843453",
//       "role": "Self",
//       "title": "T'empêches tout le monde de dormir",
//       "year": "2006",
//       "description": "(TV Series) Self - Episode dated 19 September 2006 (2006) ... Self"
//     },
//     {
//       "id": "tt0463397",
//       "role": "Self",
//       "title": "Corazón de...",
//       "year": "2006",
//       "description": "(TV Series) Self - Episode dated 17 May 2006 (2006) ... Self - Episode dated 20 March 2006 (2006) ... Self - Episode dated 24 January 2006 (2006) ... Self"
//     },
//     {
//       "id": "tt0346366",
//       "role": "Self",
//       "title": "Paris dernière",
//       "year": "2006",
//       "description": "(TV Series documentary) Self - Episode dated 3 March 2006 (2006) ... Self"
//     },
//     {
//       "id": "tt0350437",
//       "role": "Self",
//       "title": "On ne peut pas plaire à tout le monde",
//       "year": "2004-2005",
//       "description": "(TV Series) Self - Episode dated 11 December 2005 (2005) ... Self - Episode dated 8 February 2004 (2004) ... Self"
//     },
//     {
//       "id": "tt5803044",
//       "role": "Self",
//       "title": "Élection de Miss France",
//       "year": "2005",
//       "description": "(TV Series) Self - Miss France 2006 (2005) ... Self"
//     },
//     {
//       "id": "tt0482052",
//       "role": "Self",
//       "title": "Johnny Backstage",
//       "year": "2005",
//       "description": "(TV Movie documentary) Self"
//     },
//     {
//       "id": "tt0488273",
//       "role": "Self",
//       "title": "10 Year Retrospective: Cast and Crew Look Back",
//       "year": "2005",
//       "description": "(Video documentary short) Self - 'Leon'"
//     },
//     {
//       "id": "tt0488305",
//       "role": "Self",
//       "title": "Jean Reno: The Road to 'Léon'",
//       "year": "2005",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt0375285",
//       "role": "Self",
//       "title": "Comme au cinéma",
//       "year": "1998-2004",
//       "description": "(TV Series documentary) Self / Self (Interview) - Episode dated 28 September 2004 (2004) ... Self - Episode dated 23 May 2002 (2002) ... Self - Episode dated 5 April 2001 (2001) ... Self (Interview) - Episode dated 24 September 1998 (1998) ... Self"
//     },
//     {
//       "id": "tt0364154",
//       "role": "Self",
//       "title": "Campus, le magazine de l'écrit",
//       "year": "2004",
//       "description": "(TV Series documentary) Self - Episode #3.14 (2004) ... Self"
//     },
//     {
//       "id": "tt0433038",
//       "role": "Self",
//       "title": "Revealed: The Making of 'La Femme Nikita'",
//       "year": "2003",
//       "description": "(Video short documentary) Self"
//     },
//     {
//       "id": "tt18081612",
//       "role": "Self",
//       "title": "Bon anniversaire Johnny: la tournée des Stades 2003",
//       "year": "2003",
//       "description": "(TV Movie) Self"
//     },
//     {
//       "id": "tt0437724",
//       "role": "Self",
//       "title": "La semaine du cinéma",
//       "year": "2002",
//       "description": "(TV Series) Self - Episode dated 14 September 2002 (2002) ... Self"
//     },
//     {
//       "id": "tt0324360",
//       "role": "Self",
//       "title": "Un jour dans la vie du cinéma français",
//       "year": "2002",
//       "description": "(TV Movie documentary) Self"
//     },
//     {
//       "id": "tt0341901",
//       "role": "Self",
//       "title": "La nuit des Césars",
//       "year": "1995-2002",
//       "description": "(TV Series documentary) Self - Presenter / Self - Nominee - 27ème nuit des Césars (2002) ... Self - Presenter - 20ème nuit des Césars (1995) ... Self - Nominee"
//     },
//     {
//       "id": "tt0305109",
//       "role": "Self",
//       "title": "Smap×Smap",
//       "year": "2001-2002",
//       "description": "(TV Series) Self - Episode #1.670 (2002) ... Self - Episode dated 29 January 2001 (2001) ... Self"
//     },
//     {
//       "id": "tt13249746",
//       "role": "Self",
//       "title": "The Crimson Rivers: The Investigation",
//       "year": "2001",
//       "description": "(Video documentary) Self / Pierre Niemans"
//     },
//     {
//       "id": "tt4731080",
//       "role": "Self",
//       "title": "Tous avec Line",
//       "year": "2001",
//       "description": "(TV Movie) Self"
//     },
//     {
//       "id": "tt0289670",
//       "role": "Self",
//       "title": "The Book That Wrote Itself",
//       "year": "1999",
//       "description": "Self"
//     },
//     {
//       "id": "tt3242620",
//       "role": "Self",
//       "title": "Master of Desaster: Roland Emmerich - eine Hollywoodkarriere",
//       "year": "1998",
//       "description": "(TV Movie documentary) Self (uncredited)"
//     },
//     {
//       "id": "tt5424636",
//       "role": "Self",
//       "title": "Ronin: Filming in the Fast Lane",
//       "year": "1998",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt5424568",
//       "role": "Self",
//       "title": "Ronin: Venice Film Festival Interviews",
//       "year": "1998",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt0115383",
//       "role": "Self",
//       "title": "TFI Friday",
//       "year": "1998",
//       "description": "(TV Series) Self - Episode #4.11 (1998) ... Self"
//     },
//     {
//       "id": "tt0373558",
//       "role": "Self",
//       "title": "Lo + plus",
//       "year": "1998",
//       "description": "(TV Series) Self - Guest - Episode dated 11 November 1998 (1998) ... Self - Guest"
//     },
//     {
//       "id": "tt0387261",
//       "role": "Self",
//       "title": "Godzilla: On Assignment with Charles Caiman",
//       "year": "1998",
//       "description": "(Video documentary short) Self"
//     },
//     {
//       "id": "tt0106053",
//       "role": "Self",
//       "title": "Late Show with David Letterman",
//       "year": "1998",
//       "description": "(TV Series) Self - Guest - Episode dated 25 September 1998 (1998) ... Self - Guest"
//     },
//     {
//       "id": "tt0483455",
//       "role": "Self",
//       "title": "Capital",
//       "year": "1998",
//       "description": "(TV Series documentary) Self - Guest - Réussir ailleurs (1998) ... Self - Guest"
//     },
//     {
//       "id": "tt0090523",
//       "role": "Self",
//       "title": "At the Movies",
//       "year": "1998",
//       "description": "(TV Series) Self - Godzilla/Fear and Loathing in Las Vegas/Bulworth/The Horse Whisperer (1998) ... Self"
//     },
//     {
//       "id": "tt5788214",
//       "role": "Self",
//       "title": "Signé croisette",
//       "year": "1998",
//       "description": "(TV Series) Self - Episode dated 23 May 1998 (1998) ... Self"
//     },
//     {
//       "id": "tt0196277",
//       "role": "Self",
//       "title": "Nulle part ailleurs",
//       "year": "1996-1997",
//       "description": "(TV Series) Self - Episode dated 1 October 1997 (1997) ... Self - Episode dated 4 October 1996 (1996) ... Self"
//     },
//     {
//       "id": "tt4426390",
//       "role": "Self",
//       "title": "Stars'N Co",
//       "year": "1997",
//       "description": "(TV Series) Self - Episode dated 28 September 1997 (1997) ... Self"
//     },
//     {
//       "id": "tt0480279",
//       "role": "Self",
//       "title": "20 heures le journal",
//       "year": "1996",
//       "description": "(TV Series) Self - Episode dated 21 October 1996 (1996) ... Self"
//     },
//     {
//       "id": "tt0416426",
//       "role": "Self",
//       "title": "Studio Gabriel",
//       "year": "1994-1996",
//       "description": "(TV Series) Self - Episode dated 7 October 1996 (1996) ... Self - Episode dated 19 April 1995 (1995) ... Self - Episode dated 13 September 1994 (1994) ... Self"
//     },
//     {
//       "id": "tt0106052",
//       "role": "Self",
//       "title": "Late Night with Conan O'Brien",
//       "year": "1996",
//       "description": "(TV Series) Self - Guest - Marv Albert/Jean Reno/Alejandro Escovedo (1996) ... Self - Guest"
//     },
//     {
//       "id": "tt3748852",
//       "role": "Self",
//       "title": "Les Enfoirés",
//       "year": "1996",
//       "description": "(TV Series) Self - La soirée des Enfoirés (1996) ... Self"
//     },
//     {
//       "id": "tt0113011",
//       "role": "Self",
//       "title": "To Make a Film Is to Be Alive",
//       "year": "1995",
//       "description": "(Documentary) Self (uncredited)"
//     },
//     {
//       "id": "tt4293760",
//       "role": "Self",
//       "title": "Joyeux anniversaire Monsieur Trenet",
//       "year": "1995",
//       "description": "(TV Movie) Self"
//     },
//     {
//       "id": "tt3753910",
//       "role": "Self",
//       "title": "Victoires de la musique",
//       "year": "1995",
//       "description": "(TV Series) Self - Les 10èmes Victoires de la musique (1995) ... Self"
//     },
//     {
//       "id": "tt0306320",
//       "role": "Self",
//       "title": "Dream On",
//       "year": "1994",
//       "description": "(TV Series documentary) Self - Episode dated 25 March 1994 (1994) ... Self"
//     },
//     {
//       "id": "tt0454036",
//       "role": "Self",
//       "title": "Primer plano",
//       "year": "1993",
//       "description": "(TV Series) Self - Interviewee - Episode dated 29 October 1993 (1993) ... Self - Interviewee"
//     },
//     {
//       "id": "tt13465208",
//       "role": "Self",
//       "title": "Durand la nuit",
//       "year": "1992-1993",
//       "description": "(TV Series) Self - Episode dated 4 May 1993 (1993) ... Self - Episode dated 21 September 1992 (1992) ... Self"
//     },
//     {
//       "id": "tt4275008",
//       "role": "Self",
//       "title": "Téléthon",
//       "year": "1991",
//       "description": "(TV Series) Self - Episode dated 6 December 1991 (1991) ... Self"
//     },
//     {
//       "id": "tt0346428",
//       "role": "Self",
//       "title": "Télé-Zèbre",
//       "year": "1991",
//       "description": "(TV Series) Self - Episode dated 5 January 1991 (1991) ... Self"
//     },
//     {
//       "id": "tt1650389",
//       "role": "Self",
//       "title": "Au coeur de Nikita",
//       "year": "1990",
//       "description": "(Documentary short) Self"
//     },
//     {
//       "id": "tt0173581",
//       "role": "Self",
//       "title": "Les nuls, l'émission",
//       "year": "1990",
//       "description": "(TV Series) Self - Episode #1.3 (1990) ... Self"
//     },
//     {
//       "id": "tt0346544",
//       "role": "Self",
//       "title": "L'aventure du Grand Bleu",
//       "year": "1989",
//       "description": "(TV Movie) Self"
//     },
//     {
//       "id": "tt16397314",
//       "role": "Archive footage",
//       "title": "V.O.S.: Lo que NO te cuentan",
//       "year": "2021",
//       "description": "(TV Mini Series documentary) Self - El cine de animación (2021) ... Self (uncredited)"
//     },
//     {
//       "id": "tt0364157",
//       "role": "Archive footage",
//       "title": "Les enfants de la télé",
//       "year": "2021",
//       "description": "(TV Series) Self - Episode dated 17 January 2021 (2021) ... Self (uncredited)"
//     },
//     {
//       "id": "tt9083074",
//       "role": "Archive footage",
//       "title": "TPMP refait la semaine!",
//       "year": "2018",
//       "description": "(TV Series) Self - Episode #1.8 (2018) ... Self"
//     },
//     {
//       "id": "tt5623078",
//       "role": "Archive footage",
//       "title": "Non mais t'as vu ce que t'écoutes",
//       "year": "2018",
//       "description": "(TV Series) Self - Chansons françaises: le moment où ça a merdé (critique) (2018) ... Self"
//     },
//     {
//       "id": "tt4656392",
//       "role": "Archive footage",
//       "title": "Lego Dimensions",
//       "year": "2015",
//       "description": "(Video Game) Franz Krieger (uncredited)"
//     },
//     {
//       "id": "tt11635416",
//       "role": "Archive footage",
//       "title": "Les Chroniques du Mea",
//       "year": "2014",
//       "description": "(TV Series) Self - Les Visiteurs 2 Les Couloirs du Temps (1998) (2014) ... Self"
//     },
//     {
//       "id": "tt1749539",
//       "role": "Archive footage",
//       "title": "Special Collector's Edition",
//       "year": "2012",
//       "description": "(TV Series) Ruby - Especial Top Comedias (2012) ... Ruby"
//     },
//     {
//       "id": "tt1743990",
//       "role": "Archive footage",
//       "title": "Cinemassacre's Monster Madness",
//       "year": "2008",
//       "description": "(TV Series documentary) Philippe Roaché - Godzilla 1998 (2008) ... Philippe Roaché"
//     },
//     {
//       "id": "tt0812224",
//       "role": "Archive footage",
//       "title": "Cannes 2006: Crónica de Carlos Boyero",
//       "year": "2006",
//       "description": "(TV Movie) Self"
//     },
//     {
//       "id": "tt0441933",
//       "role": "Archive footage",
//       "title": "La mandrágora",
//       "year": "2005",
//       "description": "(TV Series) Félix - Episode dated 21 December 2005 (2005) ... Félix"
//     },
//     {
//       "id": "tt1687868",
//       "role": "Archive footage",
//       "title": "Francis Veber artisan du rire: La mécanique dure rire",
//       "year": "2002",
//       "description": "(Video documentary) Jean Campana"
//     },
//     {
//       "id": "tt5424620",
//       "role": "Archive footage",
//       "title": "Ronin: Composing the 'Ronin' Score",
//       "year": "1998",
//       "description": "(Video documentary short) Vincent"
//     },
//     {
//       "id": "tt5424610",
//       "role": "Archive footage",
//       "title": "Ronin: In the 'Ronin' Cutting Room with Editor Tony Gibbs",
//       "year": "1998",
//       "description": "(Video documentary short) Vincent"
//     },
//     {
//       "id": "tt5424606",
//       "role": "Archive footage",
//       "title": "Ronin: Natasha McElhone - An Actor's Process",
//       "year": "1998",
//       "description": "(Video documentary short) Vincent"
//     }
//   ],
//   "errorMessage": ""
// }
