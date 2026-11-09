import { useEffect, useState } from "react";
import Search from "../components/Search.jsx";
import EmptyState from '../components/EmptyState.jsx';
import MediaCard from "../components/MediaCard.jsx";
import MediaCardSkeleton from "../components/MediaCardSkeleton.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import Pagination from '../components/Pagination.jsx';
import HeroBanner from "../components/HeroBanner.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import { useDebounce } from "react-use";
import { fetchMoviesFromTMDB, fetchTrendingMovies, fetchGenres } from "../services/tmdb.js";
import { getMostSearchedMedia } from "../services/appwrite.js";

const Movies = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [moviesList, setMoviesList] = useState([]);
    const [errormessage, setErrormessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [mostSearchedMovies, setMostSearchedMovies] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

    useEffect(() => {
        const loadHeaderData = async () => {
            try {
                const [trendData, searchedData, genresList] = await Promise.all([
                    fetchTrendingMovies().catch(() => ({ results: [] })),
                    getMostSearchedMedia(10, 'movie').catch(() => []),
                    fetchGenres('movie').catch(() => [])
                ]);

                if (trendData.results?.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(trendData.results.length, 5));
                    setFeaturedMovie(trendData.results[randomIndex]);
                }

                setMostSearchedMovies(searchedData || []);
                setGenres(genresList || []);
            } catch (error) {
                console.error("Error loading header data:", error);
            }
        };

        loadHeaderData();
    }, []);

    const loadMovies = async (query = '', page = 1, genreId = null) => {
        setLoading(true);
        setErrormessage(null);

        try {
            const data = await fetchMoviesFromTMDB(query, page, genreId);

            if (!data.results || data.results.length === 0) {
                setMoviesList([]);
                setTotalPages(1);
                return;
            }

            setMoviesList(data.results);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);

        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrormessage('Error fetching movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
    };

    const handleSelectGenre = (genreId) => {
        setSelectedGenre(genreId);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (searchTerm) {
            setSelectedGenre(null);
        }
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadMovies(debouncedSearchTerm, currentPage, selectedGenre);
    }, [debouncedSearchTerm, currentPage, selectedGenre]);

    return (
        <div className="wrapper space-y-6">
            
            {featuredMovie && (
                <div className="mb-4">
                    <HeroBanner media={featuredMovie} />
                </div>
            )}

<div className="search-filter-bar">
    <Search 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        placeholder="Search for a movie..." 
    />
    {!searchTerm && (
        <GenreFilter 
            genres={genres} 
            selectedGenre={selectedGenre} 
            onSelectGenre={handleSelectGenre} 
        />
    )}
</div>

            {mostSearchedMovies.length > 0 && (
                <MediaCarousel
                    title="Most Popular Movies"
                    items={mostSearchedMovies}
                    isRanked={true}
                    defaultMediaType="movie"
                />
            )}

            <section className="all-movies pt-8 border-t border-slate-800/60">
                <h2>
                    {debouncedSearchTerm 
                        ? `Search Results for "${debouncedSearchTerm}"` 
                        : selectedGenre 
                            ? `${genres.find(g => g.id === selectedGenre)?.name || ''} Movies`
                            : 'Explore All Movies'
                    }
                </h2>

                {loading ? (
                    <ul>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <MediaCardSkeleton key={index} />
                        ))}
                    </ul>
                ) : errormessage ? (
                    <p className="error-msg">{errormessage}</p>
                ) : moviesList.length === 0 ? (
                    <EmptyState searchTerm={debouncedSearchTerm} />
                ) : (
                    <ul>
                        {moviesList.map((movie) => (
                            <MediaCard key={movie.id} media={movie} defaultType="movie" />
                        ))}
                    </ul>
                )}

                {!loading && moviesList.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
        </div>
    );
};

export default Movies;