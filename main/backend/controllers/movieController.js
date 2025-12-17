function mapMovie(m) {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    release_date: m.release_date,
    vote_average: m.vote_average,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
  };
}

function ensureApiKey(res) {
  const key = (process.env.TMDB_API_KEY || "").trim();
  if (!key) {
    res.status(500).json({
      error: "Server misconfigured",
      details: "TMDB_API_KEY is missing/empty in backend/.env",
    });
    return null;
  }
  return key;
}

export async function getPopularMovies(req, res) {
  try {
    const apiKey = ensureApiKey(res);
    if (!apiKey) return;

    const region = req.query.region || "FI";
    const language = req.query.language || "fi-FI";
    const page = req.query.page || "1";

    const url = new URL("https://api.themoviedb.org/3/movie/popular");
    url.searchParams.set("region", region);
    url.searchParams.set("language", language);
    url.searchParams.set("page", page);
    url.searchParams.set("api_key", apiKey); 

    const tmdbRes = await fetch(url);
    if (!tmdbRes.ok) {
      const text = await tmdbRes.text();
      return res.status(tmdbRes.status).json({ error: "TMDB error", details: text });
    }

    const data = await tmdbRes.json();
    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: (data.results || []).map(mapMovie),
    });
  } catch (e) {
    console.error("Popular movies error:", e);
    res.status(500).json({ error: e.message });
  }
}

export async function getNowPlayingMovies(req, res) {
  try {
    const apiKey = ensureApiKey(res);
    if (!apiKey) return;

    const region = req.query.region || "FI";
    const language = req.query.language || "fi-FI";
    const page = req.query.page || "1";

    const url = new URL("https://api.themoviedb.org/3/movie/now_playing");
    url.searchParams.set("region", region);
    url.searchParams.set("language", language);
    url.searchParams.set("page", page);
    url.searchParams.set("api_key", apiKey); 

    const tmdbRes = await fetch(url);
    if (!tmdbRes.ok) {
      const text = await tmdbRes.text();
      return res.status(tmdbRes.status).json({ error: "TMDB error", details: text });
    }

    const data = await tmdbRes.json();
    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: (data.results || []).map(mapMovie),
    });
  } catch (e) {
    console.error("Now playing movies error:", e);
    res.status(500).json({ error: e.message });
  }
}
