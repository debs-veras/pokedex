import { GiCrossedSwords, GiHeartPlus, GiShield } from "react-icons/gi";
import { Pokemon } from "../../types/pokemon.d";


export function PokemonCard({
  pokemon,
  setIsModalOpen,
  setSelectedPokemon,
}: {
  pokemon: Pokemon;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}) {
  const primaryType = pokemon.types[0];
  const handleOnClickCard = () => {
    setIsModalOpen(true);
    setSelectedPokemon(pokemon);
  };
  return (
    <>
      <div
        className={`group relative cursor-pointer rounded-xl border bg-gradient-to-b from-gray-800/80 to-gray-900 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_12px]`}
        onClick={handleOnClickCard}
        style={{
          borderColor: primaryType.color,
        }}
      >
        {/* Número do Pokémon */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold text-${primaryType}-300 bg-gray-900/80 px-2 py-1 rounded-full`}
        >
          #{pokemon.id.toString().padStart(3, "0")}
        </span>

        {/* Imagem */}
        <div className="p-4 pt-10 flex justify-center">
          <div className="w-32 h-32 relative">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="p-4 pt-0">
          <h3 className="text-center font-bold text-lg capitalize mb-2">
            {pokemon.name}
          </h3>

          {/* Tipos (como tags) */}
          <div className="flex justify-center gap-2 mb-3">
            {pokemon.types.map((type) => (
              <span
                key={type.name}
                className={`text-xs px-2 py-1 rounded-full bg-${type.name}-500/20 text-${type.name}-300 capitalize`}
                style={{
                  backgroundColor: type.color + "20",
                  color: type.color,
                }}
              >
                {type.name}
              </span>
            ))}
          </div>

          {/* Stats principais */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center m-auto">
              <p className="text-gray-400 flex gap-1">
                <GiHeartPlus size={16} className="text-red-400 mb-1" />
                HP
              </p>
              <p>{pokemon.stats.hp}</p>
            </div>
            <div className="text-center m-auto">
              <p className="text-gray-400 flex gap-1">
                <GiCrossedSwords size={16} className="text-orange-300 mb-1" />
                ATK
              </p>
              <p>{pokemon.stats.attack}</p>
            </div>
            <div className="text-center m-auto">
              <p className="text-gray-400 flex gap-1">
                <GiShield size={16} className="text-blue-300 mb-1" />
                DEF
              </p>
              <p>{pokemon.stats.defense}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
    </>
  );
}
