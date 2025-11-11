import React from 'react'

export default function App() {
  const cards = new Array(5).fill(0)
  return (
    <>
      <header>
        <div className="logo">Movies</div>
        <input type="search" placeholder="Search" />
        <button>Favorites</button>
        <button>+</button>
        <button className="user">Sign in / Register</button>
      </header>

      <main>
        <section>
          <h2>Now in theaters</h2>
          <div className="movies-grid">
            {cards.map((_, i) => (
              <div className="movie-card" key={'now-'+i}>
                <div className="stars">
                  <span>★</span><span>★</span><span>★</span><span className="empty">★</span><span className="empty">★</span>
                </div>
                <div className="movie-desc">movie title and description</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Popular movies</h2>
          <div className="movies-grid">
            {cards.map((_, i) => (
              <div className="movie-card" key={'pop-'+i}>
                <div className="stars">
                  <span>★</span><span>★</span><span>★</span><span className="empty">★</span><span className="empty">★</span>
                </div>
                <div className="movie-desc">movie title and description</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
