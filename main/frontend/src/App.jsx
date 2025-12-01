import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import NowPlaying from "../components/NowPlaying.jsx";
import Footer from "../components/Footer";
import Logo from "../src/assets/movies-app.png";
import MovieSearch from "../components/MovieSearch.jsx";
import FavoritesList from "../components/FavoritesList.jsx";
import Register from "../screens/Register";
import Login from "../screens/Login";
import PopularMovies from "../components/PopularMovies.jsx";

const HomePage = () => {
  const cards = new Array(5).fill(0);
  return (
    <>
      <NowPlaying />
      <PopularMovies />
    </>
  );
};

export default function App() {
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-left">
            {/* Sivuston logo */}
            <img src={Logo} alt="Site logo" className="site-logo" />
            <h1 className="site-title">Movies</h1>
          </div>
          <div className="header-center">
            {/* Hakupalkki elokuville */}
            <MovieSearch />
          </div>
          <div className="header-right">
            <button onClick={() => setShowFavorites(!showFavorites)}>
              {showFavorites ? 'Hide Favorites' : 'Favorites'}
            </button>
            <button>+</button>
            {/* Navigointi sisäänkirjautumis- ja rekisteröitymissivuille */}
            <Link to="/login">
              <button className="user">Sign in</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        {showFavorites && <FavoritesList />}
        <Routes>
          {/* Oletusreitti ohjaa etusivulle */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Etusivu */}
          <Route path="/home" element={<HomePage />} />
          {/* Rekisteröitymissivu */}
          <Route path="/register" element={<Register />} />
          {/* Sisäänkirjautumissivu */}
          <Route path="/login" element={<Login />} />
          {/* Muu ohjaus ohjataan etusivulle */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      {/* Sivuston alatunniste */}
      <Footer />
    </>
  );
}
