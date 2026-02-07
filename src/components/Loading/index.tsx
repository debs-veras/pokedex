import { Pokeball } from "../../icons";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <Pokeball className="w-16 h-16 text-yellow-500 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 border-b-yellow-500 animate-spin"></div>
      </div>
      <p className="mt-6 text-xl text-gray-400">Procurando Pokémon...</p>
      <p className="text-gray-600 mt-2">Isso pode levar um momento</p>
    </div>
  );
}
