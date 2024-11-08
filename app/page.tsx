"use client";

import { useLatestMovies } from "./hooks/useLatestMovies";
import Navbar from "./components/Navbar";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";

export default function Home() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setSearchQuery,
  } = useLatestMovies();

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error fetching movies</p>;

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Navbar onSearch={handleSearch} />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
              >
                {movie.video_url ? (
                  <iframe
                    src={movie.video_url}
                    title={movie.title}
                    width="100%"
                    height="250"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-thumbnail mb-4"
                  />
                ) : movie.poster_path ? ( // Cek apakah poster_path ada
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={250}
                    className="video-thumbnail mb-4"
                  />
                ) : (
                  <div className="video-thumbnail mb-4 bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-600">No Image Available</p>
                  </div>
                )}
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            ))}
          </React.Fragment>
        ))}
        {isFetchingNextPage && <p>Loading more movies...</p>}
      </div>
      {isFetching && !isFetchingNextPage && data?.pages.length ? (
        <p>Searching...</p>
      ) : null}
    </div>
  );
}
