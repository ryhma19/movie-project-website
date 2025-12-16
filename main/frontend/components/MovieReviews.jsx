import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

/**
 * MovieReviews-komponentti
 * Näyttää elokuvan arvostelut ja sallii uusien arvostelun lisäämisen
 */
export default function MovieReviews({ tmdbId, movieTitle }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lomakkeen tila
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userId = localStorage.getItem('userId');
  const userHasReview = reviews.some(r => r.user_id === parseInt(userId));

  useEffect(() => {
    loadReviews();
    loadAverageRating();
  }, [tmdbId]);

  const loadReviews = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/movie/${tmdbId}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
      setError(null);
    } catch (e) {
      console.error('Error loading reviews:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/movie/${tmdbId}/average`);
      if (!res.ok) throw new Error('Failed to load average rating');
      const data = await res.json();
      setAverageRating(data.average);
    } catch (e) {
      console.error('Error loading average rating:', e);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('You must be logged in to post a review');
      return;
    }

    if (!body.trim()) {
      alert('Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          tmdbId,
          rating: parseInt(rating),
          body: body.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to post review');
      }

      // Päivitä listaa
      await loadReviews();
      await loadAverageRating();
      setBody('');
      setRating(5);
      setShowForm(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      if (!res.ok) throw new Error('Failed to delete review');

      setReviews(reviews.filter(r => r.id !== reviewId));
      await loadAverageRating();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
      <h3>User Reviews</h3>
      <p style={{ color: '#bbb', fontSize: '14px', marginBottom: '16px' }}>
        Reviews from our community users (separate from TMDB ratings above)
      </p>

      {/* Average rating */}
      <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold', color: '#ffe066' }}>
        ⭐ {averageRating.toFixed(1)} ({reviews.length} reviews)
      </div>

      {/* Add review form */}
      {userId && !userHasReview ? (
        <>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={{ marginBottom: '12px' }}>
              + Add Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: '#333',
                    color: '#ffe066',
                    border: '1px solid #555',
                  }}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} - {'⭐'.repeat(n)}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Review:</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      ) : userId && userHasReview ? (
        <div style={{ marginBottom: '12px', color: '#bbb', fontSize: '14px' }}>
          You have already reviewed this movie.
        </div>
      ) : (
        <div style={{ marginBottom: '12px', color: '#bbb', fontSize: '14px' }}>
          <Link to="/login" style={{ color: '#9cf' }}>Log in</Link> to post a review.
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p style={{ color: 'tomato' }}>Error: {error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                borderLeft: '3px solid #ffe066',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <strong style={{ color: '#fff' }}>{review.display_name}</strong>
                  <span style={{ marginLeft: '8px', color: '#ffe066' }}>
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                {userId === review.user_id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    style={{
                      background: 'rgba(255, 100, 100, 0.3)',
                      border: '1px solid #ff6464',
                      color: '#ff9999',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#bbb', marginBottom: '6px' }}>
                {new Date(review.created_at).toLocaleDateString('fi-FI')}
              </div>
              <p style={{ margin: '0', color: '#ddd', lineHeight: '1.5' }}>
                {review.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
