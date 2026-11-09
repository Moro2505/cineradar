import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSearchSuggestions } from '../services/tmdb.js';

const NavbarSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedTerm.trim()) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        const getSuggestions = async () => {
            setLoading(true);
            try {
                const results = await fetchSearchSuggestions(debouncedTerm);
                setSuggestions(results);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        getSuggestions();
    }, [debouncedTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectMedia = (item) => {
        setIsOpen(false);
        setSearchTerm('');
        navigate(`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`);
    };

    return (
        <div className="nav-search-container" ref={searchRef}>
            <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search movies & TV..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                />
                {loading && <div className="search-spinner" />}
            </div>

            {isOpen && (
                <div className="search-dropdown">
                    {suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((item) => {
                                const title = item.title || item.name;
                                const releaseYear = (item.release_date || item.first_air_date || '').split('-')[0];
                                const poster = item.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                    : '/no-movie.png';

                                return (
                                    <li key={item.id} onClick={() => handleSelectMedia(item)}>
                                        <img src={poster} alt={title} />
                                        <div className="item-info">
                                            <p className="item-title">{title}</p>
                                            <div className="item-meta">
                                                <span className="type-tag">{item.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                                                {releaseYear && <span>{releaseYear}</span>}
                                                {item.vote_average > 0 && (
                                                    <span className="rating-tag">★ {item.vote_average.toFixed(1)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="no-results">No matches found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;