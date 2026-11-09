import React, { useEffect, useState } from 'react';
import { fetchPersonDetails } from '../services/tmdb.js';
import Spinner from './Spinner.jsx';
import { useNavigate } from 'react-router-dom';

const ActorModal = ({ personId, onClose }) => {
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!personId) return;

        const getActorData = async () => {
            try {
                setLoading(true);
                const data = await fetchPersonDetails(personId);
                setActor(data);
            } catch (err) {
                console.error("Error fetching actor details:", err);
                onClose();
            } finally {
                setLoading(false);
            }
        };

        getActorData();
    }, [personId, onClose]);

    if (!personId) return null;

    const uniqueCast = [];
    const seenIds = new Set();

    (actor?.combined_credits?.cast || [])
        .filter((item) => item.poster_path)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .forEach((item) => {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                uniqueCast.push(item);
            }
        });

    const knownFor = uniqueCast.slice(0, 6);

    return (
        <div className="actor-modal-backdrop" onClick={onClose}>
            <div className="actor-modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="close-btn" title="Close">✕</button>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Spinner />
                    </div>
                ) : actor ? (
                    <>
                        <div className="actor-header">
                            <img 
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                                alt={actor.name} 
                            />
                            <div className="actor-info">
                                <h2>{actor.name}</h2>
                                {actor.birthday && (
                                    <p className="meta-text">
                                        Born: {actor.birthday} {actor.place_of_birth ? `• ${actor.place_of_birth}` : ''}
                                    </p>
                                )}
                                <p className="bio">
                                    {actor.biography && actor.biography.trim() !== "" 
                                        ? actor.biography 
                                        : "No biography available for this actor."}
                                </p>
                            </div>
                        </div>

                        {knownFor.length > 0 && (
                            <div className="filmography-section">
                                <h3>Known For</h3>
                                <div className="filmography-grid">
                                    {knownFor.map((item) => {
                                        const type = item.media_type || (item.title ? 'movie' : 'tv');
                                        const itemTitle = item.title || item.name;

                                        return (
                                            <div 
                                                key={`${item.id}-${type}`} 
                                                className="film-item"
                                                onClick={() => {
                                                    onClose();
                                                    navigate(`/${type}/${item.id}`);
                                                }}
                                            >
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} 
                                                    alt={itemTitle} 
                                                />
                                                <p>{itemTitle}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default ActorModal;