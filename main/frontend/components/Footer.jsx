import React from "react";
import tmdbLogo from "../public/tmdb.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>Powered by</span>
        <img src={tmdbLogo} alt="TMDB Logo" className="tmdb-logo" />
      </div>
    </footer>
  );
}
