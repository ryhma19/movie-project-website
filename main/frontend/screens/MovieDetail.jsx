import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieReviews from '../components/MovieReviews';
import FavoriteButton from '../components/FavoriteButton';

export default function MovieDetail() {
  const { tmdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovieDetails();
  }, [tmdbId]);

  const loadMovieDetails = async () => {
    try {
      // Fetch from TMDB API to get movie details
      const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbKey}&language=fi-FI`
      );
      if (!res.ok) throw new Error('Failed to load movie');
      const data = await res.json();
      setMovie(data);
    } catch (e) {
      console.error('Error loading movie:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'tomato' }}>Error: {error || 'Movie not found'}</p>
        <Link to="/home">Back to Home</Link>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/home" style={{ color: 'var(--accent)', marginBottom: '12px', display: 'inline-block' }}>
        ← Back to Home
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', marginTop: '20px' }}>
        {/* Poster */}
        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '16px',
                boxShadow: '0 12px 24px #000000af',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '2/3',
                backgroundColor: '#333',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              No image
            </div>
          )}
          <FavoriteButton
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
          />
        </div>

        {/* Movie info and reviews */}
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--accent)' }}>{movie.title}</h1>
          
          {movie.release_date && (
            <div style={{ marginBottom: '12px', color: 'var(--muted)' }}>
              {new Date(movie.release_date).toLocaleDateString('fi-FI')}
            </div>
          )}

          {movie.vote_average && (
            <div style={{ marginBottom: '12px', color: 'var(--text)', fontSize: '18px', fontWeight: 'bold' }}>
              ⭐ {movie.vote_average.toFixed(1)} / 10 (TMDB Global Rating)
            </div>
          )}

          {movie.overview && (
            <div style={{ marginBottom: '20px', color: 'var(--text)', lineHeight: '1.6' }}>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'var(--text)' }}>Genres:</strong>{' '}
              <span style={{ color: 'var(--muted)' }}>
                {movie.genres.map(g => g.name).join(', ')}
              </span>
            </div>
          )}

          {movie.runtime && (
            <div style={{ marginBottom: '20px', color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)' }}>Runtime:</strong> {movie.runtime} min
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <MovieReviews tmdbId={tmdbId} movieTitle={movie.title} />

      <div style={{ marginTop: '40px' }}>
        <Link to="/home" style={{ color: 'var(--accent)' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
