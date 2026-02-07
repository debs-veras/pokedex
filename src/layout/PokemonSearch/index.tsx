import { useState, useEffect, useRef, useCallback } from "react";
import Modal from "../Modal";

import {
  getAllPokemon,
  getPokemonNameOrId,
  getPokemonType,
} from "../../services/pokemon.Request";

import { Pokemon } from "../../types/pokemon.d";
import useDebounce from "../../hooks/useDebounce";

import { PokemonCard } from "../../components/PokemonCard";
import { Loading } from "../../components/Loading";
import { LoadingMore } from "../../components/LoadingMore";

import { SearchControls } from "./SearchControls";
import { NoResults } from "./NoResults";
import { WelcomeCard } from "./WelcomeCard";

import { formatPokemonData } from "../../utils/formatTypeDataPokemon";

export default function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);

  // Loading principal (nova busca)
  const [isSearching, setIsSearching] = useState(false);

  // Loading do scroll infinito
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [filterType, setFilterType] = useState<string | null>(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  const limit = 12;

  // =========================
  // SCROLL INFINITO
  // =========================
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isSearching || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isSearching, isLoadingMore, hasMore],
  );

  // =========================
  // FETCH ALL
  // =========================
  const handleSearchAllPokemon = async (loadMore: boolean) => {
    const currentOffset = loadMore ? offset : 0;

    const response = await getAllPokemon(limit, currentOffset);
    const data = (response as { sucesso: true; data: any }).data;

    const promises = data.results.map(async (p: { url: string }) => {
      const res = await fetch(p.url);
      return formatPokemonData(await res.json());
    });

    const newPokemons = await Promise.all(promises);

    setSearchResults((prev) =>
      loadMore ? [...prev, ...newPokemons] : newPokemons,
    );

    setHasMore(data.results.length === limit);
    setOffset(currentOffset + limit);
  };

  // =========================
  // FETCH POR TIPO
  // =========================
  const handleSearchTypePokemonOrAllPokemon = async (loadMore: boolean) => {
    if (!filterType) return;

    if (filterType === "todos") {
      await handleSearchAllPokemon(loadMore);
      return;
    }

    const currentOffset = loadMore ? offset : 0;

    const response = await getPokemonType(filterType, limit, currentOffset);
    const data = (response as { sucesso: true; data: any }).data;

    const pokemonNames = data.pokemon
      .map((p: any) => p.pokemon.name)
      .slice(currentOffset, currentOffset + limit);

    const promises = pokemonNames.map(async (name: string) => {
      const res = await getPokemonNameOrId(name);
      return formatPokemonData((res as { sucesso: true; data: any }).data);
    });

    const newPokemons = await Promise.all(promises);

    setSearchResults((prev) =>
      loadMore ? [...prev, ...newPokemons] : newPokemons,
    );

    setHasMore(data.pokemon.length > currentOffset + limit);
    setOffset(currentOffset + limit);
  };

  // =========================
  // FETCH POR NOME
  // =========================
  const handleSearchNamePokemon = async () => {
    const response = await getPokemonNameOrId(searchTerm.toLowerCase());

    if (!response.sucesso) setSearchResults([]);
    else {
      const pokemon = await formatPokemonData(
        (response as { sucesso: true; data: any }).data,
      );
      setSearchResults([pokemon]);
    }

    setHasMore(false);
  };

  // =========================
  // CONTROLE CENTRAL DE BUSCA
  // =========================
  const handleSearch = async (loadMore = false) => {
    if (!loadMore) setIsSearching(true);

    try {
      if (filterType) {
        await handleSearchTypePokemonOrAllPokemon(loadMore);
      } else if (searchTerm.trim()) {
        await handleSearchNamePokemon();
      } else {
        await handleSearchAllPokemon(loadMore);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      if (loadMore) setIsLoadingMore(false);
      else setIsSearching(false);
    }
  };

  // =========================
  // LOAD MORE
  // =========================
  const loadMore = () => {
    if (!isSearching && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      handleSearch(true);
    }
  };

  // =========================
  // OUTROS CONTROLES
  // =========================
  const clearSearch = () => {
    setSearchTerm("");
    setFilterType(null);
    setSearchResults([]);
    setOffset(0);
    setHasMore(true);
  };

  const handleTypeFilter = (type: string) => {
    setFilterType(type === filterType ? null : type);
    setSearchTerm("");
    setOffset(0);
  };

  const fetchDebounced = useDebounce(handleSearch, 800);

  useEffect(() => {
    if (filterType !== null || searchTerm) {
      setIsSearching(true);
      fetchDebounced();
    }
  }, [filterType, searchTerm]);

  // =========================
  // RENDER
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          showTypeFilter={showTypeFilter}
          setShowTypeFilter={setShowTypeFilter}
          isSearching={isSearching}
          handleSearch={() => fetchDebounced()}
          clearSearch={clearSearch}
          searchResults={searchResults}
          handleTypeFilter={handleTypeFilter}
        />

        {isSearching ? (
          <Loading />
        ) : searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  setIsModalOpen={setIsModalOpen}
                  setSelectedPokemon={setSelectedPokemon}
                />
              ))}

              <div ref={lastElementRef} className="h-10" />
            </div>

            {isLoadingMore && <LoadingMore />}
          </>
        ) : (searchTerm || filterType) && !isSearching ? (
          <NoResults
            filterType={filterType}
            searchTerm={searchTerm}
            clearSearch={clearSearch}
            handleSearchAllPokemon={handleSearchAllPokemon}
          />
        ) : (
          <WelcomeCard />
        )}
      </div>

      {isModalOpen && selectedPokemon && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pokemon={selectedPokemon}
        />
      )}
    </div>
  );
}
