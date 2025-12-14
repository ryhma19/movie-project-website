import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton.jsx";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = (params.get("query") || "").trim();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!query) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) setResults(data.results || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [query]);

  return (
    <section className="container">
      <h2>Search results</h2>
      {loading && <p>Loading...</p>}
      {!loading && results.length === 0 && <p>No results.</p>}

      {!loading && results.length > 0 && (
        <div className="movies-grid">
          {results.map((movie) => (
            <div className="movie-card" key={movie.id} style={{ position: "relative" }}>
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

              <FavoriteButton movieId={movie.id} movieTitle={movie.title} />

              <div className="stars">⭐ {movie.vote_average?.toFixed?.(1) ?? "–"}</div>
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
  );
}
