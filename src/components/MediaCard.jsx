import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTMDBImage } from '../services/tmdb.js';

const MediaCard = ({ media, defaultType = 'movie' }) => {
    const navigate = useNavigate();

    const { 
        id, 
        title, 
        name, 
        vote_average, 
        poster_path, 
        release_date, 
        first_air_date, 
        original_language, 
        media_type 
    } = media;

    const displayTitle = title || name || 'Untitled';
    const displayDate = release_date || first_air_date || '';
    const releaseYear = displayDate ? displayDate.split('-')[0] : 'N/A';
    const type = media_type || defaultType;

    return (
        <li 
            className="movie-card group" 
            onClick={() => navigate(`/${type}/${id}`)}
        >
            <img
                src={getTMDBImage(poster_path, 'w342')}
                alt={displayTitle}
                loading="lazy"
                decoding="async"
            />

            <div className="mt-4">
                <h3>{displayTitle}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="/star.svg" alt="Star Icon" decoding="async" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className="lang">{original_language}</p>

                    <span>•</span>
                    <p className="year">{releaseYear}</p>
                </div>
            </div>
        </li>
    );
};

export default memo(MediaCard);