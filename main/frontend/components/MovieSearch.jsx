// MovieSearch-komponentti: hakee elokuvia TMDB:n API:sta hakusanan perusteella
import React, { useState } from "react";
import FavoriteButton from "./FavoriteButton.jsx";

// TMDB API-avain .env-tiedostosta
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// TMDB:n API:n perusosoite
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function MovieSearch() {
  // Hakukentän arvo
  const [searchQuery, setSearchQuery] = useState("");
  // Hakutulokset
  const [searchResults, setSearchResults] = useState([]);
  // Näytetäänkö "Loading..."
  const [isSearching, setIsSearching] = useState(false);
  // Näytetäänkö hakutulokset
  const [showResults, setShowResults] = useState(false);

  // Käsittelee hakulomakkeen lähetyksen
  const handleSearch = async (e) => {
    e.preventDefault(); // Estetään sivun uudelleenlataus
    if (!searchQuery.trim()) return; // Ei haeta tyhjällä hakusanalla
    setIsSearching(true); // Näytetään "Loading..."
    setShowResults(true); // Näytetään tulokset
    try {
      // Rakennetaan TMDB hakupyyntö
      const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url); // Lähetetään pyyntö
      const data = await response.json(); // Parsitaan vastaus
      setSearchResults(data.results || []); // Tallennetaan hakutulokset
    } catch (error) {
      setSearchResults([]); // Virhetilanteessa tyhjät tulokset
    } finally {
      setIsSearching(false); // Piilotetaan "Loading..."
    }
  };

  // Renderöidään hakukenttä ja tulokset
  return (
    <section>
      {/* Hakulomake */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Päivitetään hakusana
        />
      </form>
      {/* Hakutulokset */}
      {showResults && (
        <div>
          <h2>Search results</h2>
          {/* Näytetään latausviesti */}
          {isSearching && <p>Loading...</p>}
          {/* Ei tuloksia */}
          {!isSearching && searchResults.length === 0 && <p>No results.</p>}
          {/* Tulokset löytyivät */}
          {!isSearching && searchResults.length > 0 && (
            <div className="movies-grid">
              {searchResults.map((movie) => (
                <div className="movie-card" key={movie.id} style={{ position: 'relative' }}>
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
                  {/* Suosikkinappi */}
                  <FavoriteButton movieId={movie.id} movieTitle={movie.title} />
                  {/* Elokuvan arvosana */}
                  <div className="stars">
                    ⭐ {movie.vote_average?.toFixed?.(1) ?? "–"}
                  </div>
                  {/* Elokuvan nimi ja julkaisupäivä */}
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
