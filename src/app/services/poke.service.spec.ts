import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokeService } from './poke.service';

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
    const mockPokemons = {
      results: [
        { name: 'bulbasaur', url: '...' },
        { name: 'charmander', url: '...' }
      ],
      count: 2
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
    const mockPokemon = {
      name: 'pikachu',
      id: 25,
      sprites: { front_default: 'some-url' }
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
    const mockSpecies = {
      name: 'pikachu',
      habitat: { name: 'forest' }
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
