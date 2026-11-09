import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMediaDetails } from '../services/tmdb.js'; 

const HeroBanner = ({ media }) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  if (!media) return null;

  const title = media.title || media.name;
  const mediaType = media.media_type || (media.title ? 'movie' : 'tv');
  const releaseYear = (media.release_date || media.first_air_date || '').split('-')[0];
  const backdropUrl = media.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}` 
    : '/hero-bg.png';

  const handleWatchTrailer = async () => {
    if (trailerKey) {
      setShowTrailer(true);
      return;
    }
    try {
      setLoadingTrailer(true);
      const data = await fetchMediaDetails(mediaType, media.id);
      const trailer = data?.videos?.results?.find(
        (vid) => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      } else {
        alert("No trailer available for this title.");
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <div 
      className="hero-banner"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="badges">
            <span className="badge-type">{mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
            {media.vote_average > 0 && (
              <span className="badge-rating">★ {media.vote_average.toFixed(1)}</span>
            )}
            {releaseYear && <span className="badge-year">{releaseYear}</span>}
          </div>

          <h1>{title}</h1>

          {media.overview && (
            <p className="overview">{media.overview}</p>
          )}

          <div className="hero-actions">
            <button 
              onClick={handleWatchTrailer} 
              disabled={loadingTrailer}
              className="btn-primary"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {loadingTrailer ? 'Loading...' : 'Watch Trailer'}
            </button>

            <button 
              onClick={() => navigate(`/${mediaType}/${media.id}`)} 
              className="btn-secondary"
            >
              More Details
            </button>
          </div>
        </div>
      </div>

      {showTrailer && trailerKey && (
        <div className="modal-backdrop" onClick={() => setShowTrailer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;