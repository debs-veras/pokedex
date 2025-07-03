import { Pokeball, PokeballOpen } from "../../icons";

export default function Header() {
  return (
    <header className="text-center my-12">
      <div className="flex items-center group transition-transform hover:scale-105 justify-center mb-8">
        <div className="relative">
          <div className="absolute -inset-3 border-4 border-yellow-500 rounded-xl transform rotate-3 opacity-70 group-hover:opacity-100 transition" />
          <div className="relative bg-gray-800 px-8 py-4 rounded-xl border-2 border-gray-600 flex items-center space-x-4">
            <Pokeball className="w-10 h-10 text-yellow-400 animate-spin-slow group-hover:hidden" />
            <PokeballOpen className="w-10 h-10 text-yellow-400 hidden group-hover:block animate-bounce" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-wider font-pokemon">
              POKÉDEX
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-6 animate-float">
        <p className="text-lg text-yellow-300 mb-4">
          Professor Carvalho: "Escolha seu parceiro cuidadosamente!"
        </p>
        <div className="inline-flex items-center px-8 py-3 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded-full text-lg font-bold shadow-lg hover:shadow-red-500/40 transition-all">
          <Pokeball className="w-6 h-6 mr-2" />
          Iniciar Jornada
        </div>
      </div>
    </header>
  );
}
