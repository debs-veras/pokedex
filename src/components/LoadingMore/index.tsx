import { BiLoader } from "react-icons/bi";

export function LoadingMore() {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/70 border border-gray-700 shadow-md">
        <BiLoader className="w-4 h-4 animate-spin text-yellow-400" />
        <span className="text-sm text-gray-300">
          Carregando mais Pokémon...
        </span>
      </div>
    </div>
  );
}
