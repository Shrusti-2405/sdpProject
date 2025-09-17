import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Real-time search
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search items by name or category..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;