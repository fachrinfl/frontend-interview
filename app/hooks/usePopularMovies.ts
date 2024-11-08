import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../utils/axios";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export const usePopularMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["popularMovies"],
    queryFn: async () => {
      const { data } = await tmdbApi.get("/movie/popular");
      return data.results;
    },
  });
};
