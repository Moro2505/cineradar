import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
    if (!genres || genres.length === 0) return null;

    return (
        <div className="genre-dropdown">
            <select
                value={selectedGenre || ''}
                onChange={(e) => onSelectGenre(e.target.value ? Number(e.target.value) : null)}
            >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GenreFilter;