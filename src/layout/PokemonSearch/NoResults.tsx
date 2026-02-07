import { Pokeball } from "../../icons";

type NoResultsProps = {
  filterType: string | null;
  searchTerm: string;
  clearSearch: () => void;
  handleSearchAllPokemon: (loadMore: boolean) => Promise<void>;
};

export function NoResults({
  filterType,
  searchTerm,
  clearSearch,
  handleSearchAllPokemon,
}: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 shadow-inner">
      <img
        src="/pikachu-sad.png"
        alt="No results"
        className="w-32 h-32 object-contain opacity-70"
      />
      <p className="mt-6 text-xl text-gray-300">Nenhum Pokemon encontrado</p>
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
        Ver todos Pokemon
      </button>
    </div>
  );
}
