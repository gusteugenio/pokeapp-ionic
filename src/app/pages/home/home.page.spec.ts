import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePage } from './home.page';
import { PokeService } from 'src/app/services/poke.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const mockPokemonsResponse = {
    count: 3,
    results: [
      { name: 'pikachu', url: 'url-pikachu' },
      { name: 'bulbasaur', url: 'url-bulbasaur' },
    ],
  };

  const mockPokeService = {
    getPokemons: jasmine.createSpy('getPokemons').and.returnValue(of(mockPokemonsResponse)),
    getPokemonByNameOrId: jasmine.createSpy('getPokemonByNameOrId').and.callFake((name: string) =>
      of({
        name,
        id: name === 'pikachu' ? 25 : 1,
        sprites: { front_default: `url-to-${name}.png` },
      })
    ),
  };

  const mockFavoriteService = {
    isFavorite: jasmine.createSpy('isFavorite').and.callFake((name: string) =>
      ['pikachu'].includes(name)
    ),
    toggleFavorite: jasmine.createSpy('toggleFavorite'),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: PokeService, useValue: mockPokeService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockPokeService.getPokemons.calls.reset();
    mockPokeService.getPokemonByNameOrId.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemons on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(mockPokeService.getPokemons).toHaveBeenCalledWith(component.limit, component.offset);
    expect(mockPokeService.getPokemonByNameOrId).toHaveBeenCalledTimes(mockPokemonsResponse.results.length);
    expect(component.pokemons.length).toBe(mockPokemonsResponse.results.length);
    expect(component.pokemons[0].name).toBe('pikachu');
    expect(component.totalPokemons).toBe(mockPokemonsResponse.count);
  }));

  it('should not go to next page if no more pokemons', fakeAsync(() => {
    component.offset = 0;
    component.limit = 2;
    component.totalPokemons = 3;

    // Página 1: 2 pokémons
    component.loadPokemons();
    tick();

    // Página 2: 1 pokémon
    component.nextPage();
    tick();

    expect(component.offset).toBe(2);

    // Continua na página 2, pois não há mais pokémons
    component.nextPage();
    tick();

    expect(component.offset).toBe(2);
  }));

  it('should go to previous page and load pokemons only if offset >= limit', fakeAsync(() => {
    component.offset = 2;
    component.limit = 2;

    component.prevPage();
    tick();

    expect(component.offset).toBe(0);
    expect(mockPokeService.getPokemons).toHaveBeenCalledWith(component.limit, 0);
  }));

  it('should not go to previous page if offset < limit', fakeAsync(() => {
    component.offset = 1;
    component.limit = 2;

    component.prevPage();

    expect(component.offset).toBe(1);
    expect(mockPokeService.getPokemons).not.toHaveBeenCalled();
  }));

  it('should navigate to details page', () => {
    component.goToDetails('pikachu');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details', 'pikachu']);
  });

  it('should check if a pokemon is favorite', () => {
    expect(component.isFavorite('pikachu')).toBeTrue();
    expect(component.isFavorite('bulbasaur')).toBeFalse();
  });

  it('should toggle favorite', () => {
    component.toggleFavorite('pikachu');
    expect(mockFavoriteService.toggleFavorite).toHaveBeenCalledWith('pikachu');
  });
});
