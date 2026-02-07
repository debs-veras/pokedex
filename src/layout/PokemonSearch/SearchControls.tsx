import {
  BiChevronDown,
  BiChevronUp,
  BiLoader,
  BiSearch,
  BiX,
} from "react-icons/bi";
import { Pokemon } from "../../types/pokemon.d";
import { typeColorMap } from "../../utils/formatTypeDataPokemon";

export type SearchControlsProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string | null;
  showTypeFilter: boolean;
  setShowTypeFilter: (value: boolean) => void;
  isSearching: boolean;
  handleSearch: () => void;
  clearSearch: () => void;
  searchResults: Pokemon[];
  handleTypeFilter: (type: string) => void;
};

export function SearchControls({
  searchTerm,
  setSearchTerm,
  filterType,
  showTypeFilter,
  setShowTypeFilter,
  isSearching,
  handleSearch,
  clearSearch,
  searchResults,
  handleTypeFilter,
}: SearchControlsProps) {
  return (
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
            <span>{filterType ? `Type: ${filterType}` : "Filter by Type"}</span>
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
  );
}
