import React from 'react';

const emptyState = ({ searchTerm }) => {
  return (
    <div className="empty-state">
      <div className="icon-box">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </div>

      <h3>No Movies Found</h3>

      <p>
        We couldn't find any movies matching{" "}
        {searchTerm ? (
          <span>"{searchTerm}"</span>
        ) : (
          "your search"
        )}
        . Try checking for typos or searching with another keyword.
      </p>
    </div>
  );
};

export default emptyState;