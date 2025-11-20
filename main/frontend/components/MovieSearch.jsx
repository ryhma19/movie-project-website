import React, { useState } from "react";

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
      const response = await fetch(
        `http://localhost:3000/api/movies/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.movies || []);
      } else {
        setSearchResults([]);
      }
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
