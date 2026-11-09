import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageSubmit = () => {
    let pageNum = parseInt(inputPage, 10);
    if (isNaN(pageNum)) {
      setInputPage(currentPage);
      return;
    }

    const maxPages = Math.min(totalPages, 500); 
    if (pageNum > maxPages) pageNum = maxPages;
    if (pageNum < 1) pageNum = 1;

    setInputPage(pageNum);
    if (pageNum !== currentPage) {
      onPageChange(pageNum);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageSubmit();
      e.target.blur(); 
    }
  };

  const maxAllowedPage = Math.min(totalPages, 500);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="info">
        <span>Page</span>
        <input
          type="text"
          inputMode="numeric"
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handlePageSubmit}
          onKeyDown={handleKeyDown}
        />
        <span>of <span className="total">{maxAllowedPage}</span></span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxAllowedPage}
        aria-label="Next Page"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;