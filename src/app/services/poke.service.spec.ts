import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokeService } from './poke.service';
import { PokemonListResponse } from '../models/pokemon-list-response.model';
import { Pokemon } from '../models/pokemon.model';
import { PokemonSpecies } from '../models/pokemon-species.model';

describe('PokeService', () => {
  let service: PokeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeService]
    });

    service = TestBed.inject(PokeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of pokemons', () => {
    const mockPokemons: PokemonListResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: '...' },
        { name: 'charmander', url: '...' }
      ]
    };
    const limit = 2;
    const offset = 0;

    service.getPokemons(limit, offset).subscribe(pokemons => {
      expect(pokemons).toEqual(mockPokemons);
    });

    const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPokemons);
  });

  it('should retrieve a pokemon by name or id', () => {
    const mockPokemon: Pokemon = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'some-url' },
      types: [
        { type: { name: 'electric' } }
      ],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
        { base_stat: 40, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 90, stat: { name: 'speed' } }
      ]
    };

    const nameOrId = 'pikachu';

    service.getPokemonByNameOrId(nameOrId).subscribe(pokemon => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('should retrieve pokemon species by name', () => {
    const mockSpecies: PokemonSpecies = {
      flavor_text_entries: [
        {
          flavor_text: "Quando exposto ao calor, ele armazena energia elétrica nas bochechas.",
        }
      ],
      language: { name: 'en' }
    };
    const name = 'pikachu';

    service.getPokemonSpecies(name).subscribe(species => {
      expect(species).toEqual(mockSpecies);
    });

    const req = httpMock.expectOne(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecies);
  });
});
