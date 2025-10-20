import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import '../styles/MovieSearch.css';

function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setMovies([]);
      return;
    }

    const searchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${debouncedSearchTerm}&apikey=trilogy`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'No movies found');
        }

        setMovies(data.Search || []);
      } catch (err) {
        setError(err.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearchTerm]);

  return (
    <div className="movie-search">
      <h2>🎬 Movie Search</h2>
      <p className="description">
        Search movies with debounced input using the <code>useDebounce</code> hook
      </p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies (try 'Matrix', 'Avengers', 'Star Wars')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-button"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      <div className="search-info">
        {searchTerm && searchTerm !== debouncedSearchTerm && (
          <p className="typing-indicator">⌨️ Typing...</p>
        )}
        {debouncedSearchTerm && (
          <p className="search-query">Searching for: <strong>{debouncedSearchTerm}</strong></p>
        )}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching movies...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {!loading && !error && movies.length === 0 && debouncedSearchTerm && (
        <div className="no-results">
          <p>🔍 No movies found for "{debouncedSearchTerm}"</p>
        </div>
      )}

      {movies.length > 0 && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <div className="movie-poster">
                {movie.Poster !== 'N/A' ? (
                  <img src={movie.Poster} alt={movie.Title} />
                ) : (
                  <div className="no-poster">🎬</div>
                )}
              </div>
              <div className="movie-info">
                <h3>{movie.Title}</h3>
                <p className="movie-year">{movie.Year}</p>
                <span className="movie-type">{movie.Type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="explanation">
        <h3>💡 Key Concepts</h3>
        <ul>
          <li><strong>Debouncing:</strong> Delays API call until user stops typing</li>
          <li><strong>Performance:</strong> Reduces unnecessary network requests</li>
          <li><strong>User Experience:</strong> Shows typing indicator during debounce</li>
          <li><strong>Custom Hook:</strong> useDebounce encapsulates debounce logic</li>
          <li><strong>Conditional Rendering:</strong> Different UI states for loading/error/data</li>
        </ul>
      </div>
    </div>
  );
}

export default MovieSearch;
