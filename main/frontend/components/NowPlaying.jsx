import React, { useEffect, useRef, useState } from "react";
import FavoriteButton from "./FavoriteButton.jsx";

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const scrollerRef = useRef(null);
  const [step, setStep] = useState(240);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("http://localhost:3000/api/movies/now-playing");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setMovies(data.results ?? []);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector(".np-card");
    if (!firstCard) return;
    const style = window.getComputedStyle(el);
    const gap = parseInt(style.columnGap || "16", 10);
    setStep(firstCard.offsetWidth + gap);
  }, [movies]);

  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: (dir === "right" ? 1 : -1) * step * 5, behavior: "smooth" });
  };

  if (loading) return (
    <section className="np-section container">
      <h2 className="np-title">Now in theaters</h2>
      <p>Loading…</p>
    </section>
  );

  if (err) return (
    <section className="np-section container">
      <h2 className="np-title">Now in theaters</h2>
      <p style={{ color: "tomato" }}>Error: {err}</p>
    </section>
  );

  return (
    <section className="np-section container">
      <h2 className="np-title">Now in theaters</h2>

      <div className="np-carousel">
        <button className="np-nav np-left" aria-label="Previous" onClick={() => scrollByCards("left")}>‹</button>

        <div className="np-scroller" ref={scrollerRef}>
          {movies.map(m => (
            <article className="np-card" key={m.id} style={{ position: 'relative' }}>
              <div className="np-imgwrap">
                {m.poster
                  ? <img src={m.poster} alt={m.title} />
                  : <div className="np-placeholder">No image</div>}
              </div>
              <FavoriteButton movieId={m.id} movieTitle={m.title} />
              <div className="np-meta">
                <div className="np-stars">⭐ {m.vote_average?.toFixed?.(1) ?? "–"}</div>
                <h3 className="np-name">{m.title}</h3>
                <div className="np-date">{m.release_date ? new Date(m.release_date).toLocaleDateString("fi-FI"): ""}</div>
              </div>
            </article>
          ))}
        </div>

        <button className="np-nav np-right" aria-label="Next" onClick={() => scrollByCards("right")}>›</button>
      </div>
    </section>
  );
}
