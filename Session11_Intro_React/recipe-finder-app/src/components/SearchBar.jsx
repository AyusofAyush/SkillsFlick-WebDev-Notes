// src/components/SearchBar.jsx - Interactive search component
import { useState } from 'react';

function SearchBar({ onSearch, searchTerm, onSearchTermChange }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchTermChange(localSearchTerm);
    onSearch(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearchTermChange('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search recipes, ingredients..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="search-input"
        />
        {localSearchTerm && (
          <button 
            type="button" 
            className="clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-btn">
          🔍 Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;