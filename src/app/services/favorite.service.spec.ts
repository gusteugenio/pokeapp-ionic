import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainerService } from './trainer.service';

// Atenção: Ao descomentar o uso do webhook, os testes irão falhar se esperar por alguma chamada.
describe('FavoriteService', () => {
  let service: FavoriteService;
  let trainerMock: TrainerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    localStorage.clear();
  });

  beforeEach(() => {
    service = TestBed.inject(FavoriteService);
    trainerMock = TestBed.inject(TrainerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load favorites from localStorage on creation', () => {
    localStorage.setItem('pokemon_favorites', JSON.stringify(['pikachu']));
    service = new FavoriteService(httpMock as any, trainerMock as any);

    expect(service.getFavorites()).toEqual(['pikachu']);
  });

  it('should return empty favorites if none saved', () => {
    expect(service.getFavorites()).toEqual([]);
  });

  it('should not add duplicate favorite', () => {
    service.addFavorite('charmander');
    service.addFavorite('charmander');

    expect(service.getFavorites().filter(f => f === 'charmander').length).toBe(1);
  });

  it('should toggle favorite correctly', () => {
    service.addFavorite('pikachu');
    expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).toContain('pikachu');
    expect(service.isFavorite('pikachu')).toBeTrue();

    service.toggleFavorite('pikachu');
    expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).not.toContain('pikachu');
    expect(service.isFavorite('pikachu')).toBeFalse();
  });
});
