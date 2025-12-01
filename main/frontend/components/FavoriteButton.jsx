import React, { useState } from 'react';

/**
 * FavoriteButton-komponentti
 * Näyttää sydän ikonin elokuvan kohdalla ja sitä klikkaamalla voi lisätä/poistaa elokuvan suosikeista
 */
export default function FavoriteButton({ movieId, movieTitle, initialIsFavorite = false }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // Käsittelee suosikkien lisäämisen/poistamisen
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Estetään kortin klikkaus
    e.stopPropagation(); // Estetään tapahtuman kupliminen
    
    setIsLoading(true);

    try {
      // Haetaan käyttäjän ID localStoragesta (oletetaan että se tallennettiin kirjautumisen yhteydessä)
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        alert('You must be logged in to add favorites');
        setIsLoading(false);
        return;
      }

      if (isFavorite) {
        // Poistetaan suosikki
        const response = await fetch(`http://localhost:3000/api/favorites/${userId}/${movieId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsFavorite(false);
        } else {
          alert('Failed to remove favorite');
        }
      } else {
        // Lisätään suosikki
        const response = await fetch('http://localhost:3000/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            mediaId: movieId,
            title: movieTitle,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          alert('Failed to add favorite');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer',
        fontSize: '1.2rem',
        padding: '0.25rem',
        transition: 'transform 0.2s',
        zIndex: 10,
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
