import axios from "axios";

const API_KEY = "a489d4bc8ffe59c0d5d9099ef02fe46a";
const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});
