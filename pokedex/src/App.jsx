import React, { useState, useEffect } from "react";
import "./App.css";

const PokedexLight = ({ colorClass }) => (
  <div className={`pokedex-light ${colorClass}`}></div>
);

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1024"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon data. Please try again later.");
        }
        const data = await response.json();

        const pokemonData = data.results.map((pokemon, index) => {
          const id = index + 1;
          return {
            name: pokemon.name,
            id: id,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
        });

        setAllPokemon(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching Pokémon:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const results = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(results);
  }, [searchTerm, allPokemon]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="pokedex-body">
      <div className="pokedex">
        <header className="pokedex-header">
          <div className="pokedex-header-lights">
            <div className="pokedex-header-light-main"></div>
            <PokedexLight colorClass="light-red" />
            <PokedexLight colorClass="light-yellow" />
            <PokedexLight colorClass="light-green" />
          </div>
        </header>

        <div className="pokedex-screen">
          <h1 className="pokedex-title">Pokédex</h1>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>

          <main>
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <PokemonGrid pokemonList={filteredPokemon} />
            )}
          </main>
        </div>

        <footer className="pokedex-footer">
          <p>
            Powered by the{" "}
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
              PokéAPI
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

const PokemonGrid = ({ pokemonList }) => {
  if (pokemonList.length === 0) {
    return <p className="no-pokemon-found">No Pokémon found.</p>;
  }

  return (
    <div className="pokemon-grid">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <div className="pokemon-card-image-wrapper">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className="pokemon-card-image"
          loading="lazy"
        />
      </div>
      <h2 className="pokemon-card-name">{pokemon.name}</h2>
      <p className="pokemon-card-id">#{String(pokemon.id).padStart(3, "0")}</p>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p className="loading-text">Loading...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <strong>Error!</strong>
    <p>{message}</p>
  </div>
);
