import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Teste() {
  const [selectionStage, setSelectionStage] = useState<
    "selecting" | "confirming" | "confirmed"
  >("selecting");
  const [selectedStarter, setSelectedStarter] = useState<number | null>(null);
  const navigate = useNavigate();

  const starterPokemon = [
    {
      id: 1,
      name: "Bulbasaur",
      type: "grass",
      colorClass: "bg-gradient-to-b from-green-500 to-green-700",
    },
    {
      id: 4,
      name: "Charmander",
      type: "fire",
      colorClass: "bg-gradient-to-b from-red-500 to-orange-600",
    },
    {
      id: 7,
      name: "Squirtle",
      type: "water",
      colorClass: "bg-gradient-to-b from-blue-400 to-blue-600",
    },
  ];

  const handleStarterSelect = (id: number) => {
    setSelectedStarter(id);
    setSelectionStage("confirming");
  };

  const confirmSelection = () => {
    setSelectionStage("confirmed");
    setTimeout(() => {
      navigate(`/pokedex?starter=${selectedStarter}`);
    }, 2000);
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center border-b border-yellow-400/30 pb-2">
        {selectionStage === "confirmed"
          ? "Boa escolha, Treinador!"
          : "Escolha seu Pokémon Inicial"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {starterPokemon.map((pokemon) => {
          const isSelected = selectedStarter === pokemon.id;
          const isDisabled =
            (selectionStage === "confirming" && !isSelected) ||
            selectionStage === "confirmed";

          return (
            <button
              key={pokemon.id}
              onClick={() => handleStarterSelect(pokemon.id)}
              disabled={isDisabled}
              className={`
                relative overflow-hidden rounded-xl p-1 transition-all duration-300
                ${isSelected ? "scale-105 z-10" : ""}
                ${isDisabled ? "opacity-50" : "hover:scale-105 cursor-pointer"}
              `}
            >
              <div
                className={`absolute inset-0 ${pokemon.colorClass} rounded-xl opacity-30`}
              ></div>

              <div
                className={`
                  bg-gray-800/90 backdrop-blur-sm border-2 rounded-lg p-6 text-center
                  ${isSelected ? `border-${pokemon.type}-400` : "border-gray-700"}
                  h-full flex flex-col items-center transition-all
                `}
              >
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  {isSelected && (
                    <div
                      className={`absolute inset-0 bg-${pokemon.type}-400/20 rounded-full animate-ping`}
                    ></div>
                  )}
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className={`relative z-10 w-full h-full object-contain transition-transform ${
                      isSelected ? "scale-110" : ""
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold capitalize mb-2">
                  {pokemon.name}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${pokemon.type}-500/20 text-${pokemon.type}-300`}
                >
                  {pokemon.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectionStage === "confirming" && selectedStarter && (
        <div className="mt-8 text-center animate-fadeIn">
          <button
            onClick={confirmSelection}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-lg font-bold text-gray-900 shadow-lg hover:shadow-yellow-500/40 transition-all"
          >
            Confirmar Escolha
          </button>
        </div>
      )}

      {selectionStage === "confirmed" && selectedStarter && (
        <>
          <div className="mt-8 text-center animate-fadeIn">
            <div className="inline-block bg-gray-800/80 border border-yellow-400/30 rounded-xl px-6 py-4">
              <p className="text-yellow-400 font-medium">
                Seu {starterPokemon.find((p) => p.id === selectedStarter)?.name}{" "}
                está pronto para a jornada!
              </p>
              <div className="flex justify-center mt-3 space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Animação de captura */}
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
            <div className="relative w-32 h-32">
              <img
                src="/pokeball.png"
                alt="Capturando..."
                className="w-full h-full animate-spin-slow z-10"
              />
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping z-0" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
