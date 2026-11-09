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
import { fetchTVShowsFromTMDB, fetchTrendingTVShows, fetchGenres } from "../services/tmdb.js";
import { getMostSearchedMedia } from "../services/appwrite.js";

const TVShows = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [tvList, setTvList] = useState([]);
    const [errormessage, setErrormessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    const [featuredTV, setFeaturedTV] = useState(null);
    const [mostSearchedTV, setMostSearchedTV] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

    useEffect(() => {
        const loadHeaderData = async () => {
            try {
                const [trendData, searchedData, genresList] = await Promise.all([
                    fetchTrendingTVShows().catch(() => ({ results: [] })),
                    getMostSearchedMedia(10, 'tv').catch(() => []),
                    fetchGenres('tv').catch(() => [])
                ]);

                if (trendData.results?.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(trendData.results.length, 5));
                    setFeaturedTV(trendData.results[randomIndex]);
                }

                setMostSearchedTV(searchedData || []);
                setGenres(genresList || []);
            } catch (error) {
                console.error("Error loading TV header data:", error);
            }
        };

        loadHeaderData();
    }, []);

    const loadTVShows = async (query = '', page = 1, genreId = null) => {
        setLoading(true);
        setErrormessage(null);

        try {
            const data = await fetchTVShowsFromTMDB(query, page, genreId);

            if (!data.results || data.results.length === 0) {
                setTvList([]);
                setTotalPages(1);
                return;
            }

            setTvList(data.results);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);

        } catch (error) {
            console.error(`Error fetching TV shows: ${error}`);
            setErrormessage('Error fetching TV shows. Please try again later.');
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
        loadTVShows(debouncedSearchTerm, currentPage, selectedGenre);
    }, [debouncedSearchTerm, currentPage, selectedGenre]);

    return (
        <div className="wrapper space-y-6">
            
            {featuredTV && (
                <div className="mb-4">
                    <HeroBanner media={{ ...featuredTV, media_type: 'tv' }} />
                </div>
            )}

<div className="search-filter-bar">
    <Search 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        placeholder="Search for a TV show..." 
    />
    {!searchTerm && (
        <GenreFilter 
            genres={genres} 
            selectedGenre={selectedGenre} 
            onSelectGenre={handleSelectGenre} 
        />
    )}
</div>

            {mostSearchedTV.length > 0 && (
                <MediaCarousel
                    title="Most Popular TV Shows"
                    items={mostSearchedTV}
                    isRanked={true}
                    defaultMediaType="tv"
                />
            )}

            <section className="all-movies pt-8 border-t border-slate-800/60">
                <h2>
                    {debouncedSearchTerm 
                        ? `Search Results for "${debouncedSearchTerm}"` 
                        : selectedGenre 
                            ? `${genres.find(g => g.id === selectedGenre)?.name || ''} TV Shows`
                            : 'Explore All TV Shows'
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
                ) : tvList.length === 0 ? (
                    <EmptyState searchTerm={debouncedSearchTerm} />
                ) : (
                    <ul>
                        {tvList.map((tv) => (
                            <MediaCard key={tv.id} media={tv} defaultType="tv" />
                        ))}
                    </ul>
                )}

                {!loading && tvList.length > 0 && (
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

export default TVShows;