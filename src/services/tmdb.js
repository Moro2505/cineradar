const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
    },
};

const apiCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

export const getTMDBImage = (path, size = "w342") => {
    if (!path) return "/no-movie.png";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

const fetchWithCache = async (endpoint) => {
    const now = Date.now();
    if (apiCache.has(endpoint)) {
        const { data, timestamp } = apiCache.get(endpoint);
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }
    }

    try {
        const response = await fetch(endpoint, options);
        if (response.status === 429) {
            console.warn("TMDB Rate limit hit, retrying...");
        }
        if (!response.ok) throw new Error("Failed to fetch data from TMDB");
        const data = await response.json();

        apiCache.set(endpoint, { data, timestamp: now });
        return data;
    } catch (error) {
        console.error("TMDB API Error:", error);
        return null;
    }
};

export const fetchGenres = async (mediaType = "movie") => {
    const type = mediaType === "tv" ? "tv" : "movie";
    const endpoint = `${API_BASE_URL}/genre/${type}/list?api_key=${API_KEY}`;
    const data = await fetchWithCache(endpoint);
    return data?.genres || [];
};

export const fetchMoviesFromTMDB = async (query = "", page = 1, genreId = null) => {
    const pageNum = page || 1;
    let endpoint = "";

    if (query) {
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}&page=${pageNum}`;
    } else if (genreId) {
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${genreId}&api_key=${API_KEY}&page=${pageNum}`;
    } else {
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${pageNum}`;
    }

    return await fetchWithCache(endpoint);
};

export const fetchTVShowsFromTMDB = async (query = "", page = 1, genreId = null) => {
    const pageNum = page || 1;
    let endpoint = "";

    if (query) {
        endpoint = `${API_BASE_URL}/search/tv?query=${encodeURIComponent(query)}&api_key=${API_KEY}&page=${pageNum}`;
    } else if (genreId) {
        endpoint = `${API_BASE_URL}/discover/tv?sort_by=popularity.desc&with_genres=${genreId}&api_key=${API_KEY}&page=${pageNum}`;
    } else {
        endpoint = `${API_BASE_URL}/discover/tv?sort_by=popularity.desc&api_key=${API_KEY}&page=${pageNum}`;
    }

    return await fetchWithCache(endpoint);
};

export const fetchPersonDetails = async (personId) => {
    const endpoint = `${API_BASE_URL}/person/${personId}?api_key=${API_KEY}&append_to_response=combined_credits`;
    return await fetchWithCache(endpoint);
};

export const fetchTrendingAll = async () => {
    const endpoint = `${API_BASE_URL}/trending/all/day?api_key=${API_KEY}`;
    return await fetchWithCache(endpoint);
};

export const fetchTrendingMovies = async () => {
    const endpoint = `${API_BASE_URL}/trending/movie/day?api_key=${API_KEY}`;
    return await fetchWithCache(endpoint);
};

export const fetchTrendingTVShows = async () => {
    const endpoint = `${API_BASE_URL}/trending/tv/day?api_key=${API_KEY}`;
    return await fetchWithCache(endpoint);
};

export const fetchPopularMovies = async () => {
    const endpoint = `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;
    return await fetchWithCache(endpoint);
};

export const fetchPopularTVShows = async () => {
    const endpoint = `${API_BASE_URL}/tv/popular?api_key=${API_KEY}`;
    return await fetchWithCache(endpoint);
};

export const fetchSearchSuggestions = async (query) => {
    if (!query.trim()) return [];

    const endpoint = `${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
    const data = await fetchWithCache(endpoint);

    return (data?.results || [])
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 5);
};

export const fetchMediaDetails = async (mediaType, id) => {
    const type = mediaType === "tv" ? "tv" : "movie";
    const endpoint = `${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`;
    return await fetchWithCache(endpoint);
};