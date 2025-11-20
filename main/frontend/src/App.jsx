import React from "react";
import NowPlaying from "../components/NowPlaying.jsx";
import Footer from "../components/Footer";
import Logo from "../src/assets/movies-app.png";
import MovieSearch from "../components/MovieSearch.jsx";

export default function App() {
  const cards = new Array(5).fill(0);

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-left">
            <img src={Logo} alt="Site logo" className="site-logo" />
            <h1 className="site-title">Movies</h1>
          </div>
          <div className="header-center">
            <MovieSearch />
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
