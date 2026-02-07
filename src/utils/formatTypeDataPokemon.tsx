import { Pokemon } from "../types/pokemon.d";

export const typeColorMap: { [key: string]: string } = {
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

export const formatPokemonData = async (data: any): Promise<Pokemon> => {
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
