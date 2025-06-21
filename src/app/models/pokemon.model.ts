export interface Pokemon {
  name: string;
  id?: number;
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  sprites?: {
    front_default: string;
  };
}
