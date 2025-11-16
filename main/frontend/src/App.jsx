import React, { useState } from 'react'

export default function App() {
  const cards = new Array(5).fill(0)
  
  // Hakutoiminnon state-muuttujat
  const [searchQuery, setSearchQuery] = useState('') // Käyttäjän kirjoittama hakusana
  const [searchResults, setSearchResults] = useState([]) // Haun tulokset backendistä
  const [isSearching, setIsSearching] = useState(false) // Näytetään "Loading..." hakusuorituksen aikana
  const [showResults, setShowResults] = useState(false) // Näytetäänkö hakutulokset vai ei

  // Hakufunktio - kutsutaan kun käyttäjä painaa Enter tai submit
  const handleSearch = async (e) => {
    e.preventDefault() // Estetään lomakkeen oletustoiminto (sivun uudelleenlataus)
    if (!searchQuery.trim()) return // Ei tehdä tyhjää hakua

    setIsSearching(true) // Aloitetaan haku - näytetään "Loading..."
    setShowResults(true) // Näytetään hakutulokset-osio

    try {
      // Kutsutaan backend API:a
      const response = await fetch(`http://localhost:3000/api/movies/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.movies) // Tallennetaan tulokset
      } else {
        console.error('Search error:', data.error)
        setSearchResults([]) // Tyhjä tulos virhetilanteessa
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([]) // Tyhjä tulos verkkovirheessä
    } finally {
      setIsSearching(false) // Lopetetaan "Loading..."-tila
    }
  }

  return (
    <>
      <header>
        <div className="logo">Movies</div>
        {/* Hakukenttä - submit lähettää haun kun painetaan Enter */}
        <form onSubmit={handleSearch}>
          <input 
            type="search" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Päivitetään hakusana joka kirjaimella
          />
        </form>
        <button>Favorites</button>
        <button>+</button>
        <button className="user">Sign in / Register</button>
      </header>

      <main>
        {/* Näytetään hakutulokset vain kun haku on tehty */}
        {showResults && (
          <section>
            <h2>Search Results {isSearching && '(Loading...)'}</h2>
            <div className="movies-grid">
              {/* Jos ei tuloksia eikä olla hakemassa, näytetään "ei löytynyt" */}
              {searchResults.length === 0 && !isSearching ? (
                <p>No movies found for "{searchQuery}"</p>
              ) : (
                // Näytetään jokainen haun tulos omana korttinaan
                searchResults.map((movie) => (
                  <div className="movie-card" key={movie.id}>
                    <div className="stars">
                      <span>★</span><span>★</span><span>★</span><span className="empty">★</span><span className="empty">★</span>
                    </div>
                    <div className="movie-desc">{movie.title || 'Untitled'}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

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
