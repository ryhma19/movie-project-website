import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function SharedFavorites() {
  const { token } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/favorites/shared/${token}`);
        if (!res.ok) throw new Error('Shared list not found');
        const data = await res.json();
        if (!cancelled) setFavorites(data.favorites || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <section className="favorites-section container">
      <h2>Shared Favorites</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      {!loading && !error && favorites.length === 0 && (
        <p>No favorites in this list.</p>
      )}
      {!loading && !error && favorites.length > 0 && (
        <div className="movies-grid">
          {favorites.map((favorite) => (
            <div className="movie-card" key={favorite.id} style={{ position: 'relative' }}>
              <div className="movie-image">
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {favorite.title}
                </div>
              </div>
              <div className="movie-desc">
                {favorite.title}
                <br />
                <small>Added: {new Date(favorite.added_at).toLocaleDateString('fi-FI')}</small>
              </div>
            </div>
          ))}
        </div>
      )}
      <p style={{ marginTop: 16 }}>
        <Link to="/home">Back to Home</Link>
      </p>
    </section>
  );
}
