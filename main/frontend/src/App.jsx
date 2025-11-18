import React, { useState } from "react";
import NowPlaying from "../components/NowPlaying.jsx";
import Footer from "../components/Footer";
import Logo from "../src/assets/movies-app.png";

export default function App() {
  const cards = new Array(5).fill(0);

  // Hakutoiminnon statet
  const [searchQuery, setSearchQuery] = useState(""); // käyttäjän kirjoittama hakusana
  const [searchResults, setSearchResults] = useState([]); // haun tulokset backendistä
  const [isSearching, setIsSearching] = useState(false); // true kun haku käynnissä
  const [showResults, setShowResults] = useState(false); // näytetäänkö hakutulokset-osio

  // Hakufunktio – kutsutaan kun käyttäjä painaa Enter tai submit
  const handleSearch = async (e) => {
    e.preventDefault(); // estetään lomakkeen oletustoiminto (sivun uudelleenlataus)
    if (!searchQuery.trim()) return; // tyhjää hakua ei tehdä

    setIsSearching(true);
    setShowResults(true);

    try {
      // Kutsutaan backendin hakureittiä
      const response = await fetch(
        `http://localhost:3000/api/movies/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.movies || []);
      } else {
        console.error("Search error:", data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-left">
            <img src={Logo} alt="Site logo" className="site-logo" />
            <h1 className="site-title">Movies</h1>
          </div>

          <div className="header-center">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="header-right">
            <button>Favorites</button>
            <button>+</button>
            <button className="user">Sign in / Register</button>
          </div>
        </div>
      </header>

      <main>
        <NowPlaying />

        {showResults && (
          <section>
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
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
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
          </section>
        )}

        <section>
          <h2>Popular movies</h2>
          <div className="movies-grid">
            {cards.map((_, i) => (
              <div className="movie-card" key={"pop-" + i}>
                <div className="stars">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="empty">★</span>
                  <span className="empty">★</span>
                </div>
                <div className="movie-desc">movie title and description</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
