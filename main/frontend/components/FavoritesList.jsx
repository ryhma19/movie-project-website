import React, { useState, useEffect } from 'react';

/**
 * FavoritesList-komponentti
 * Näyttää käyttäjän kaikki suosikkielokuvat
 */
export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('You must be logged in to view favorites');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/favorites/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createShare = async () => {
    setShareMsg('');
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setShareMsg('Login required to share');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}/share`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create share link');
      const data = await res.json();
      const link = `${window.location.origin}/share/${data.token}`;
      setShareLink(link);
      await navigator.clipboard?.writeText(link);
      setShareMsg('Share link copied to clipboard');
    } catch (e) {
      setShareMsg(e.message);
    }
  };

  const removeFavorite = async (tmdbId) => {
    const userId = localStorage.getItem('userId');
    
    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${userId}/${tmdbId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Päivitetään lista poistamalla elokuva
        setFavorites(favorites.filter(fav => fav.tmdb_id !== tmdbId));
      } else {
        alert('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <section className="favorites-section">
        <h2>My Favorites</h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="favorites-section">
        <h2>My Favorites</h2>
        <p style={{ color: 'tomato' }}>{error}</p>
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="favorites-section">
        <h2>My Favorites</h2>
        <p>You haven't added any favorites yet.</p>
      </section>
    );
  }

  return (
    <section className="favorites-section">
      <h2>My Favorites ({favorites.length})</h2>
      <div style={{ marginBottom: '12px' }}>
        <button onClick={createShare} className="btn" style={{ marginRight: 8 }}>Create share link</button>
        {shareLink && (
          <a href={shareLink} target="_blank" rel="noreferrer" style={{ color: '#9cf' }}>{shareLink}</a>
        )}
        {shareMsg && <div style={{ marginTop: 6, color: '#bbb' }}>{shareMsg}</div>}
      </div>
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
            <button
              onClick={() => removeFavorite(favorite.tmdb_id)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem',
                color: 'white',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Remove from favorites"
            >
              ✕
            </button>
            <div className="movie-desc">
              {favorite.title}
              <br />
              <small>Added: {new Date(favorite.added_at).toLocaleDateString('fi-FI')}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
