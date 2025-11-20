import React, { useState } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(true);
    try {
      const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      {showResults && (
        <div>
          <h2>Search results</h2>
          {isSearching && <p>Loading...</p>}
          {!isSearching && searchResults.length === 0 && <p>No results.</p>}
          {!isSearching && searchResults.length > 0 && (
            <div className="movies-grid">
              {searchResults.map((movie) => (
                <div className="movie-card" key={movie.id}>
                  <div className="movie-image">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </div>
                  <div className="stars">
                    ⭐ {movie.vote_average?.toFixed?.(1) ?? "–"}
                  </div>
                  <div className="movie-desc">
                    {movie.title}
                    <br />
                    <small>{movie.release_date}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
