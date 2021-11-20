import type * as coda from "@codahq/packs-sdk";

// Config

export async function getMovie(context: coda.ExecutionContext, query: string) {
  const url =
    "https://imdb8.p.rapidapi.com/title/find?q=" + encodeURIComponent(query);
  const response = await context.fetcher.fetch({
    method: "GET",
    headers: {
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
    url: url,
  });
  const movie = response.body.results[0];
  return {
    // grab the ID (tt0109830) out of the API's id response (/title/tt0109830/)
    IMDBId: movie.id.replace("/title/", "").replace("/", ""),
    Title: movie.title,
    Year: movie.year,
    Runtime: movie.runningTimeInMinutes + " minutes",
    Poster: movie.image.url,
  };
}
