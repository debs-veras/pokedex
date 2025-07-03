import { getRequest } from "../util/axiosRequest";

export const getAllPokemon = async (
  limit?: number | null,
  offset?: number | null
) => {
  return await getRequest(`pokemon/?limit=${limit}&offset=${offset}`);
};

export const getPokemonNameOrId = async (data: number | string) => {
  return await getRequest(`pokemon/${data}/`);
};

export const getPokemonType = async (
  data: string,
  limit?: number,
  offset?: number
) => {
  return await getRequest(`type/${data}?limit=${limit}&offset=${offset}`);
};

export const getPokemonAbility = async (data: string) => {
  return await getRequest(`ability/${data}/`);
};

// Adicione no seu arquivo pokemon.Request.ts
export async function getPokemonSpecies(name: string) {
  return await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then((res) => res.json());
}

export async function getEvolutionChain(url: string) {
  return await fetch(url).then((res) => res.json());
}
