export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
  }>;
  language: {
    name: string;
  };
}
