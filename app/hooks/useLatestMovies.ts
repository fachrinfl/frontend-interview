import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbApi } from "../utils/axios";
import { useState, useEffect, useRef } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  video_url?: string | null;
}

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const useLatestMovies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const fetchMovies = (pageParam: number) =>
    tmdbApi.get<MoviesResponse>("/movie/now_playing", {
      params: { page: pageParam },
    });

  const fetchSearchResults = (pageParam: number) =>
    tmdbApi.get<MoviesResponse>("/search/movie", {
      params: { query: debouncedQuery, page: pageParam },
    });

  const moviesQuery = useInfiniteQuery<MoviesResponse, Error>({
    queryKey: ["latestMovies", debouncedQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = debouncedQuery
        ? await fetchSearchResults(pageParam as number)
        : await fetchMovies(pageParam as number);
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  return { ...moviesQuery, setSearchQuery };
};
