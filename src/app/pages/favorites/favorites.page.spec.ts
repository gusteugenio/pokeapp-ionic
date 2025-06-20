import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoritesPage } from '../favorites/favorites.page';
import { FavoriteService } from 'src/app/services/favorite.service';
import { PokeService } from 'src/app/services/poke.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  let mockFavoriteService: any;
  const allFavorites = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'eevee'];

  const mockPokeService = {
    getPokemonByNameOrId: jasmine.createSpy('getPokemonByNameOrId').and.callFake((name: string) =>
      of({
        name,
        sprites: {
          other: {
            'official-artwork': {
              front_default: `url-to-${name}.png`
            }
          }
        }
      })
    )
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    mockFavoriteService = {
      getFavorites: jasmine.createSpy('getFavorites'),
      isFavorite: jasmine.createSpy('isFavorite').and.returnValue(true),
      toggleFavorite: jasmine.createSpy('toggleFavorite')
    };

    await TestBed.configureTestingModule({
      declarations: [FavoritesPage],
      providers: [
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: PokeService, useValue: mockPokeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;

    mockFavoriteService.getFavorites.and.returnValue(allFavorites);
    mockFavoriteService.toggleFavorite.calls.reset();
    mockPokeService.getPokemonByNameOrId.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('should load favorite Pokémon', fakeAsync(() => {
    mockFavoriteService.getFavorites.and.returnValue(['pikachu']);

    component.limit = 5;
    component.offset = 0;

    component.loadFavorites();
    tick();

    expect(mockFavoriteService.getFavorites).toHaveBeenCalled();
    expect(mockPokeService.getPokemonByNameOrId).toHaveBeenCalledTimes(1);
    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].name).toBe('pikachu');
  }));

  it('should navigate to Pokémon details page', () => {
    component.goToDetails('pikachu');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details', 'pikachu']);
  });

  it('should toggle favorite and reload list', () => {
    spyOn(component, 'loadFavorites');
    component.toggleFavorite('pikachu');
    expect(mockFavoriteService.toggleFavorite).toHaveBeenCalledWith('pikachu');
    expect(component.loadFavorites).toHaveBeenCalled();
  });

  it('should show message when no favorites', fakeAsync(() => {
    mockFavoriteService.getFavorites.and.returnValue([]);
    component.loadFavorites();
    tick();
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('.no-favorites-message'));
    expect(message).toBeTruthy();
    expect(message.nativeElement.textContent).toContain('Nenhum Pokémon foi capturado ainda');
  }));

  it('should handle pagination correctly', fakeAsync(() => {
    mockFavoriteService.getFavorites.and.returnValue(
      Array.from({ length: 25 }, (_, i) => `poke${i + 1}`)
    );

    component.limit = 10;
    component.offset = 0;
    component.loadFavorites();
    tick();

    // Página 1: não pode voltar
    expect(component.canGoPrev).toBeFalse();
    expect(component.canGoNext).toBeTrue();

    // Página 2: pode voltar e avançar
    component.nextPage();
    tick();
    expect(component.offset).toBe(10);
    expect(component.canGoPrev).toBeTrue();
    expect(component.canGoNext).toBeTrue();

    // Página 3: pode voltar, mas não avançar
    component.nextPage();
    tick();
    expect(component.offset).toBe(20);
    expect(component.canGoPrev).toBeTrue();
    expect(component.canGoNext).toBeFalse();

    // Volta para página 2
    component.prevPage();
    tick();
    expect(component.offset).toBe(10);

    // Volta para página 1
    component.prevPage();
    tick();
    expect(component.offset).toBe(0);
  }));

  it('should identify favorite status correctly', () => {
    expect(component.isFavorite('pikachu')).toBeTrue();
    expect(component.isFavorite('mewtwo')).toBeTrue();
  });
});
