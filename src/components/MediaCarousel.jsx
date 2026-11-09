import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTMDBImage } from '../services/tmdb.js';

const MediaCarousel = ({
    title,
    items,
    isRanked = false,
    seeAllLink = null,
    defaultMediaType = 'movie'
}) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const listRef = useRef(null);
    const navigate = useNavigate();

    const checkScroll = () => {
        if (listRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
        }
    };

    const handleScroll = (direction) => {
        if (listRef.current) {
            const container = listRef.current;
            const scrollAmount = container.clientWidth * 0.75;
            container.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleCardClick = (item) => {
        const type = item.media_type || (item.title ? 'movie' : (item.name ? 'tv' : defaultMediaType));
        const mediaId = item.media_id || item.id || item.movie_id;
        if (mediaId) {
            navigate(`/${type}/${mediaId}`);
        }
    };

    useEffect(() => {
        checkScroll();
    }, [items]);

    if (!items || items.length === 0) return null;

    return (
        <section className="media-carousel">
            <div className="carousel-header">
                <h2>{title}</h2>

                <div className="carousel-actions">
                    <button onClick={() => handleScroll('prev')} disabled={!canScrollLeft} title="Previous">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button onClick={() => handleScroll('next')} disabled={!canScrollRight} title="Next">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <ul ref={listRef} onScroll={checkScroll} className={isRanked ? "ranked-list" : "standard-list"}>
                {items.map((item, index) => {
                    const posterPath = item.poster_url || getTMDBImage(item.poster_path, 'w342');
                    const itemTitle = item.title || item.name || item.searchTerm;
                    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

                    return (
                        <li
                            key={item.$id || item.media_id || item.id || index}
                            onClick={() => handleCardClick(item)}
                            className="carousel-card group"
                        >
                            {isRanked && <p className="rank-number">{index + 1}</p>}
                            <div className="card-media">
                                <img src={posterPath} alt={itemTitle} loading="lazy" decoding="async" />
                                {!isRanked && (
                                    <div className="card-badge">
                                        <span>★ {rating}</span>
                                    </div>
                                )}
                            </div>
                            {!isRanked && <h3 className="card-title">{itemTitle}</h3>}
                        </li>
                    );
                })}
            </ul>

            {seeAllLink && (
                <div className="see-all-container">
                    <Link to={seeAllLink} className="see-all-btn">
                        See All <span>→</span>
                    </Link>
                </div>
            )}
        </section>
    );
};

export default MediaCarousel;