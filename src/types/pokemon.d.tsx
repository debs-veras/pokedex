export type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  stats: PokemonStats;
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  
};

export type PokemonType = {
  name: string;
  color: string;
};

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type PokemonAbility = {
  name: string;
  isHidden: boolean;
  description?: string;
};
