import React from "react";
import { useTheme } from "../hooks/useTheme";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [query, setQuery] = React.useState("");
  const { theme, toggleTheme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 p-4 mb-4 flex justify-between items-center">
      <h1 className="text-black dark:text-white text-2xl font-bold">
        Movie Finder
      </h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search movies..."
          className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
        />
        <button
          onClick={toggleTheme}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
