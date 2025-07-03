import { useState, useEffect } from "react";
import { Pokeball } from "../../icons";
import {
  BiLoader,
  BiSearch,
  BiX,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { PokemonCard } from "../../components/PokemonCard";
import Modal from "../Modal";
import {
  getAllPokemon,
  // getPokemonAbility,
  getPokemonNameOrId,
  getPokemonType,
} from "../../services/pokemon.Request";
import { Pokemon } from "../../types/pokemon.d";
import useDebounce from "../../hooks/useDebounce";

const typeColorMap: { [key: string]: string } = {
  todos: "",
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const limit: number = 12;

  // const fetchAbilities = async (abilities: any[]) => {
  //   const abilityPromises = abilities.map(async (a: any) => {
  //     try {
  //       const data = await getPokemonAbility(a.ability.name);
  //       const englishEntry = data.flavor_text_entries?.find(
  //         (entry: any) => entry.language.name === "en"
  //       );
  //       return {
  //         name: a.ability.name,
  //         isHidden: a.is_hidden,
  //         description: englishEntry?.flavor_text || "No description available",
  //       };
  //     } catch (error) {
  //       return {
  //         name: a.ability.name,
  //         isHidden: a.is_hidden,
  //         description: "Description not available",
  //       };
  //     }
  //   });
  //   return Promise.all(abilityPromises);
  // };

  const formatPokemonData = async (data: any): Promise<Pokemon> => {
    // const abilities = await fetchAbilities(data.abilities);
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => ({
        name: t.type.name,
        color: typeColorMap[t.type.name] || "bg-gray-500",
      })),
      sprite:
        data.sprites.other?.["official-artwork"]?.front_default ||
        data.sprites.front_default ||
        "/fallback-pokemon.png",
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
      abilities: data.abilities.map((a: any) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
      height: data.height / 10,
      weight: data.weight / 10,
    };
  };

  const handleSearchTypePokemonOrAllPokemon = async (loadMore: boolean) => {
    if (filterType) {
      const currentOffset = loadMore ? offset : 0;
      if (filterType === "todos") handleSearchAllPokemon(loadMore);
      else {
        setIsSearching(true);
        const response = await getPokemonType(filterType, limit, offset);
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
          loadMore ? [...prev, ...newPokemons] : newPokemons
        );
        setHasMore(data.pokemon.length > currentOffset + limit);
        setOffset(currentOffset + limit);
        setIsSearching(false);
      }
    }
  };

  const handleSearchNamePokemon = async () => {
    setIsSearching(true);
    const response = await getPokemonNameOrId(searchTerm.toLowerCase());
    if (!response.sucesso) {
      setSearchResults([]);
    } else {
      const pokemon = await formatPokemonData(
        (response as { sucesso: true; data: any }).data
      );
      setSearchResults([pokemon]);
    }
    setHasMore(false);
    setIsSearching(false);
  };

  const handleSearchAllPokemon = async (loadMore: boolean) => {
    setIsSearching(true);
    const currentOffset = loadMore ? offset : 0;
    const response = await getAllPokemon(limit, currentOffset);
    const data = (response as { sucesso: true; data: any }).data;
    const promises = data.results.map(async (p: { url: string }) => {
      const res = await fetch(p.url);
      return formatPokemonData(await res.json());
    });
    const newPokemons = await Promise.all(promises);
    setSearchResults((prev) =>
      loadMore ? [...prev, ...newPokemons] : newPokemons
    );
    setHasMore(data.results.length === limit);
    setOffset(currentOffset + limit);
    setIsSearching(false);
  };

  const handleSearch = async (loadMore = false) => {
    if (!loadMore && !searchTerm.trim() && !filterType) return;
    try {
      if (filterType) await handleSearchTypePokemonOrAllPokemon(loadMore);
      else if (searchTerm.trim()) await handleSearchNamePokemon();
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  const loadMore = () => {
    if (!isSearching && hasMore) handleSearch(true);
  };

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

  const featchDebounce = useDebounce(handleSearch, 1000);

  useEffect(() => {
    if (filterType !== null || searchTerm) featchDebounce();
  }, [filterType, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-6 relative w-full">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-px w-1/4 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            <span className="text-lg font-bold text-center text-yellow-400 px-6">
              Busque por qualquer Pokémon pelo nome ou número da Pokédex
              Nacional
            </span>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-px w-1/4 bg-gradient-to-l from-transparent via-yellow-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: Pikachu ou 25"
                className="w-full bg-gray-900/80 border-2 border-gray-700 rounded-full py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 group-hover:border-yellow-500/50 placeholder-gray-500 pr-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={!!filterType}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <BiX className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-gray-900 font-bold p-2 rounded-full transition-all duration-300 flex items-center shadow-lg hover:shadow-yellow-500/20 disabled:shadow-none"
              >
                {isSearching ? (
                  <BiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  <BiSearch className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowTypeFilter(!showTypeFilter)}
                className="flex items-center justify-between w-full sm:w-48 bg-gray-800 border-2 border-gray-700 hover:border-yellow-500/50 rounded-full py-4 px-6 text-white transition-all duration-300"
              >
                <span>
                  {filterType ? `Type: ${filterType}` : "Filter by Type"}
                </span>
                {showTypeFilter ? (
                  <BiChevronUp className="w-5 h-5 ml-2" />
                ) : (
                  <BiChevronDown className="w-5 h-5 ml-2" />
                )}
              </button>
              {showTypeFilter && (
                <div className="absolute z-10 mt-2 w-full sm:w-64 bg-gray-800 border-2 border-yellow-500/30 rounded-xl shadow-lg p-4 grid grid-cols-3 gap-2">
                  {Object.entries(typeColorMap).map(([type, color]) => (
                    <button
                      key={type}
                      onClick={() => {
                        handleTypeFilter(type);
                        setShowTypeFilter(false);
                      }}
                      className={`${color} ${
                        filterType === type ? "ring-2 ring-yellow-400" : ""
                      } text-xs sm:text-sm text-white font-medium py-2 px-1 rounded-full capitalize transition-all hover:opacity-90`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-3 px-2">
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"
            >
              <BiX className="w-4 h-4 mr-1" />
              Limpar busca
            </button>
            {searchResults.length > 0 && (
              <span className="text-gray-400 text-sm">
                Exibindo{" "}
                <span className="text-yellow-400">{searchResults.length}</span>{" "}
                Pokémon(s)
              </span>
            )}
          </div>
        </div>

        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <Pokeball className="w-16 h-16 text-yellow-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 border-b-yellow-500 animate-spin"></div>
            </div>
            <p className="mt-6 text-xl text-gray-400">Procurando Pokémon...</p>
            <p className="text-gray-600 mt-2">Isso pode levar um momento</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((pokemon) => (
                <PokemonCard
                  setIsModalOpen={setIsModalOpen}
                  setSelectedPokemon={setSelectedPokemon}
                  key={pokemon.id}
                  pokemon={pokemon}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  disabled={isSearching}
                  className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-full text-sm font-medium flex items-center mx-auto transition-all duration-300 shadow-lg hover:shadow-yellow-500/10 border border-gray-700 hover:border-yellow-500/30"
                >
                  {isSearching ? (
                    <>
                      <BiLoader className="w-4 h-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Pokeball className="w-4 h-4 mr-2" />
                      Carregar Mais Pokémon
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (searchTerm || filterType) && searchResults.length == 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 shadow-inner">
            <img
              src="/pikachu-sad.png"
              alt="No results"
              className="w-32 h-32 object-contain opacity-70"
            />
            <p className="mt-6 text-xl text-gray-300">
              Nenhum Pokémon encontrado
            </p>
            <p className="text-gray-500 mt-2">
              {filterType
                ? `para o tipo ${filterType}`
                : `com o termo "${searchTerm}"`}
            </p>
            <button
              onClick={() => {
                clearSearch();
                handleSearchAllPokemon(true);
              }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-full text-gray-900 font-medium flex items-center transition-all duration-300"
            >
              <Pokeball className="w-4 h-4 mr-2" />
              Ver todos Pokémon
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border-2 border-dashed border-gray-700/50">
            <div className="text-center max-w-md">
              <Pokeball className="w-16 h-16 mx-auto text-yellow-500/50 mb-6" />
              <h3 className="text-2xl text-gray-300 mb-4">
                Bem-vindo à Pokédex
              </h3>
              <p className="text-gray-400 mb-6">
                Comece pesquisando pelo nome ou número de um Pokémon, ou filtre
                por tipo para encontrar suas criaturas favoritas!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-yellow-400 text-sm font-medium mb-2">
                    Exemplo de Nome:
                  </p>
                  <p className="text-gray-300">"charizard"</p>
                  <p className="text-gray-300">"mewtwo"</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-yellow-400 text-sm font-medium mb-2">
                    Exemplo de Número:
                  </p>
                  <p className="text-gray-300">"6"</p>
                  <p className="text-gray-300">"150"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
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
