export interface Pokemon {
  name: string;
  url: string;
  id?: number;
  sprites?: {
    front_default: string;
    other?: { 'official-artwork': { front_default: string } };
  };
}
