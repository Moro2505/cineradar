import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMediaDetails, fetchPersonDetails } from '../services/tmdb.js';
import { updateMediaVisitCount } from '../services/appwrite.js';
import MediaCarousel from '../components/MediaCarousel.jsx';
import ActorModal from '../components/ActorModal.jsx';
import Spinner from '../components/Spinner.jsx';

const MediaDetails = () => {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = useState(null);
    const [castList, setCastList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedActorId, setSelectedActorId] = useState(null);

    const visitedRef = useRef(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                setLoading(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const data = await fetchMediaDetails(mediaType, id);
                setDetails(data);

                const currentMediaKey = `${mediaType}-${id}`;
                if (data && visitedRef.current !== currentMediaKey) {
                    visitedRef.current = currentMediaKey;
                    updateMediaVisitCount({ ...data, media_type: mediaType });
                }

                const rawCast = data?.credits?.cast?.filter((actor) => actor.profile_path)?.slice(0, 12) || [];
                
                const validatedCast = await Promise.all(
                    rawCast.map(async (actor) => {
                        try {
                            const person = await fetchPersonDetails(actor.id);
                            if (person?.biography && person.biography.trim() !== "") {
                                return actor;
                            }
                        } catch (err) {
                            return null;
                        }
                        return null;
                    })
                );

                setCastList(validatedCast.filter(Boolean).slice(0, 10));
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        getDetails();
    }, [mediaType, id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Spinner />
            </div>
        );
    }

    if (!details) {
        return (
            <div className="empty-state">
                <h3>Details not found</h3>
                <button onClick={() => navigate('/')} className="see-all-btn mt-4">Back to Home</button>
            </div>
        );
    }

    const isTV = mediaType === 'tv';
    const title = details.title || details.name;
    const releaseYear = (details.release_date || details.first_air_date || '').split('-')[0];
    const backdropUrl = details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : '/hero-bg.png';
    const posterUrl = details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : '/no-movie.png';

    const trailerVideo = details.videos?.results?.find(
        (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
    );

    const similarItems = details.similar?.results || [];

    return (
        <div className="details-page wrapper space-y-12">
            <div
                className="details-hero"
                style={{ backgroundImage: `linear-gradient(to top, #030014 10%, rgba(3,0,20,0.6) 60%, rgba(3,0,20,0.8) 100%), url(${backdropUrl})` }}
            >
                <div className="details-hero-content">
                    <div className="poster-container">
                        <img src={posterUrl} alt={title} />
                    </div>

                    <div className="info-container">
                        <div className="badges">
                            <span className="badge-type">{isTV ? 'TV Series' : 'Movie'}</span>
                            {releaseYear && <span className="badge-year">{releaseYear}</span>}
                            {details.vote_average > 0 && (
                                <span className="badge-rating">★ {details.vote_average.toFixed(1)} / 10</span>
                            )}
                        </div>

                        <h1>{title}</h1>
                        {details.tagline && <p className="tagline">"{details.tagline}"</p>}

                        <div className="genres-list">
                            {details.genres?.map((genre) => (
                                <span key={genre.id} className="genre-chip">{genre.name}</span>
                            ))}
                        </div>

                        <p className="overview">{details.overview || "No overview available for this title."}</p>

                        <div className="details-actions">
                            {trailerVideo ? (
                                <button onClick={() => setShowTrailer(true)} className="btn-primary">
                                    <svg fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Trailer
                                </button>
                            ) : (
                                <button disabled className="btn-disabled">No Trailer Available</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {castList.length > 0 && (
                <section className="cast-section">
                    <h2>Top Cast</h2>
                    <div className="cast-grid">
                        {castList.map((actor) => (
                            <div 
                                key={actor.id} 
                                className="cast-card"
                                onClick={() => setSelectedActorId(actor.id)}
                                title={`Click to view ${actor.name}'s details`}
                            >
                                <img 
                                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                                    alt={actor.name} 
                                />
                                <p className="actor-name">{actor.name}</p>
                                <p className="character-name">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="metadata-section">
                <h2>Production & Info</h2>
                <div className="metadata-grid">
                    <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className="meta-value">{details.status || 'N/A'}</span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Original Language</span>
                        <span className="meta-value uppercase">{details.original_language || 'N/A'}</span>
                    </div>

                    {isTV ? (
                        <>
                            <div className="meta-item">
                                <span className="meta-label">Seasons</span>
                                <span className="meta-value">{details.number_of_seasons || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Episodes</span>
                                <span className="meta-value">{details.number_of_episodes || 'N/A'}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="meta-item">
                                <span className="meta-label">Runtime</span>
                                <span className="meta-value">{details.runtime ? `${details.runtime} mins` : 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Budget</span>
                                <span className="meta-value">
                                    {details.budget ? `$${details.budget.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {similarItems.length > 0 && (
                <MediaCarousel
                    title={`More Like "${title}"`}
                    items={similarItems.map(item => ({ ...item, media_type: mediaType }))}
                />
            )}

            {showTrailer && trailerVideo && (
                <div className="modal-backdrop" onClick={() => setShowTrailer(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowTrailer(false)}>✕</button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
                            title="YouTube Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            <ActorModal 
                personId={selectedActorId} 
                onClose={() => setSelectedActorId(null)} 
            />
        </div>
    );
};

export default MediaDetails;