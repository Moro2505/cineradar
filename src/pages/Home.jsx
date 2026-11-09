import { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner.jsx";
import MediaCarousel from "../components/MediaCarousel.jsx";
import Spinner from "../components/Spinner.jsx";
import {
    fetchTrendingAll,
    fetchTrendingMovies,
    fetchTrendingTVShows,
    fetchPopularMovies,
    fetchPopularTVShows
} from "../services/tmdb.js";
import { getMostSearchedMedia } from "../services/appwrite.js";

const Home = () => {
    const [featuredMedia, setFeaturedMedia] = useState(null);
    const [mostSearched, setMostSearched] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingTV, setTrendingTV] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTV, setPopularTV] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);

                const [
                    allTrendingData,
                    searchedData,
                    trendMoviesData,
                    trendTVData,
                    popMoviesData,
                    popTVData
                ] = await Promise.all([
                    fetchTrendingAll().catch(() => ({ results: [] })),
                    getMostSearchedMedia(20).catch(() => []), 
                    fetchTrendingMovies().catch(() => ({ results: [] })),
                    fetchTrendingTVShows().catch(() => ({ results: [] })),
                    fetchPopularMovies().catch(() => ({ results: [] })),
                    fetchPopularTVShows().catch(() => ({ results: [] }))
                ]);

                if (allTrendingData.results?.length > 0) {
                    const randomIndex = Math.floor(Math.random() * Math.min(allTrendingData.results.length, 5));
                    setFeaturedMedia(allTrendingData.results[randomIndex]);
                }

                setMostSearched(searchedData || []);
                setTrendingMovies(trendMoviesData.results || []);
                setTrendingTV(trendTVData.results || []);
                setPopularMovies(popMoviesData.results || []);
                setPopularTV(popTVData.results || []);
            } catch (error) {
                console.error("Error loading home page data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    return (
        <div className="wrapper space-y-6">
            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <Spinner />
                </div>
            ) : (
                <>
                    <HeroBanner media={featuredMedia} />

                    {mostSearched.length > 0 && (
                        <MediaCarousel
                            title="Most Searched"
                            items={mostSearched}
                            isRanked={true}
                        />
                    )}

                    <MediaCarousel
                        title="Trending Movies"
                        items={trendingMovies}
                    />

                    <MediaCarousel
                        title="Trending TV Shows"
                        items={trendingTV}
                    />

                    <MediaCarousel
                        title="Popular Movies"
                        items={popularMovies}
                        seeAllLink="/movies"
                    />

                    <MediaCarousel
                        title="Popular TV Shows"
                        items={popularTV}
                        seeAllLink="/tv"
                    />
                </>
            )}
        </div>
    );
};

export default Home;