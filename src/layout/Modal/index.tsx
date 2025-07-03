import type { Pokemon, PokemonAbility } from "../../types/pokemon.d";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { Pokeball } from "../../icons";
import { getPokemonAbility } from "../../services/pokemon.Request";

export default function PokemonModal({
  isOpen,
  onClose,
  pokemon,
}: {
  isOpen: boolean;
  onClose: () => void;
  pokemon: Pokemon | null;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [abilities, setAbilities] = useState<Array<PokemonAbility>>([]);
  const [animationStage, setAnimationStage] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");

  const fetchAbilities = async () => {
    if (!pokemon) {
      setAbilities([]);
      return;
    }
    const abilitiesData = await Promise.all(
      pokemon.abilities.map(async (a: PokemonAbility) => {
        try {
          const response = await getPokemonAbility(a.name);
          const data = (response as { sucesso: true; data: any }).data;
          const englishEntry = data.flavor_text_entries?.find(
            (entry: any) => entry.language.name === "en"
          );
          return {
            name: a.name,
            isHidden: a.isHidden,
            description:
              englishEntry?.flavor_text || "No description available",
          };
        } catch (error) {
          console.error(error);
          return {
            name: a.name,
            isHidden: a.isHidden,
            description: "Description not available",
          };
        }
      })
    );
    setAbilities(abilitiesData);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAbilities();
      setIsVisible(true);
      setAnimationStage("opening");
      setTimeout(() => setAnimationStage("open"), 1000);
    } else {
      setAnimationStage("closing");
      setTimeout(() => {
        setIsVisible(false);
        setAnimationStage("closed");
      }, 800);
    }
  }, [isOpen]);

  if (!isVisible || !pokemon) return null;

  const primaryType = pokemon.types[0];
  const typeColor = primaryType.color;

  // Animação da Pokébola
  const pokeballVariants = {
    opening: {
      scale: 1.2,
      rotate: 360,
      transition: { duration: 0.8 },
    },
    open: {
      scale: 0,
      rotate: 360,
      opacity: 0,
      transition: { duration: 0.3 },
    },
    closing: {
      scale: 0.8,
      rotate: -180,
      opacity: 0,
      transition: { duration: 0.6 },
    },
  };

  // Animação do Pokémon
  const pokemonVariants = {
    opening: {
      scale: 1.2,
      y: -20,
      opacity: 1,
      transition: { delay: 0.5, duration: 0.7 },
    },
    open: {
      scale: 1,
      y: [0, -15, 0],
      opacity: 1,
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
    },
    closing: {
      scale: 0.8,
      y: 50,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  // Animação de entrada do conteúdo
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 1, duration: 0.5 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md min-w-[50%] overflow-hidden"
          >
            <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700 shadow-xl">
              {/* Cabeçalho com gradiente */}
              <div
                className="h-1/3 relative flex justify-center items-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${typeColor}40 0%, ${typeColor}80 100%)`,
                }}
              >
                {/* Botão de fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 bg-gray-900/50 rounded-full p-2 text-white hover:bg-gray-900 transition-colors z-20"
                >
                  <CgClose className="w-5 h-5" />
                </button>

                {/* Container de animações */}
                <div className="relative w-full h-full flex justify-center items-center">
                  {/* Animação da Pokébola */}
                  <motion.div
                    initial={{ scale: 1, rotate: 0, opacity: 1 }}
                    animate={animationStage}
                    variants={pokeballVariants}
                    className="absolute z-10"
                  >
                    <Pokeball className="w-32 h-32 text-white opacity-90" />
                  </motion.div>

                  {/* Animação do Pokémon */}
                  <motion.div
                    initial={{ scale: 0, y: 50, opacity: 0 }}
                    animate={animationStage}
                    variants={pokemonVariants}
                    className="w-60 max-h-60 h-auto z-0"
                  >
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Conteúdo do modal */}
              {animationStage === "open" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  className="flex-1 overflow-y-auto p-6 pt-20"
                >
                  {/* Nome e número */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold capitalize text-white">
                      {pokemon.name}
                    </h2>
                    <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </span>
                  </div>

                  {/* Tipos */}
                  <div className="flex gap-2 mb-8 justify-center">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.name}
                        className="px-4 py-1 rounded-full text-sm font-medium capitalize shadow-md"
                        style={{
                          backgroundColor: `${type.color}30`,
                          color: "white",
                          border: `1px solid ${type.color}`,
                        }}
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-gray-700 my-6"></div>

                  {/* Estatísticas */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Estatísticas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(pokemon.stats).map(([stat, value]) => (
                        <div
                          key={stat}
                          className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm capitalize">
                              {stat.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, value)}%`,
                                backgroundColor: typeColor,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-gray-700 my-6"></div>

                  {/* Habilidades */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Habilidades
                    </h3>
                    <div className="space-y-3">
                      {abilities.map((ability) => (
                        <div
                          key={ability.name}
                          className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className="capitalize font-medium">
                              {ability.name.replace("-", " ")}
                            </span>
                            {ability.isHidden && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                Oculta
                              </span>
                            )}
                          </div>
                          {ability.description && (
                            <p className="text-gray-400 mt-2 text-sm">
                              {ability.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-gray-700 my-6"></div>

                  {/* Peso e altura */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Altura</span>
                      </div>
                      <p className="text-lg">{pokemon.height.toFixed(1)} m</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                        <span>Peso</span>
                      </div>
                      <p className="text-lg">{pokemon.weight.toFixed(1)} kg</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
