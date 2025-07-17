import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainerService } from './trainer.service';

// Atenção: Ao descomentar o uso do webhook, os testes irão falhar se esperar por alguma chamada.
describe('FavoriteService', () => {
  let service: FavoriteService;
  let httpMock: HttpTestingController;
  let trainerServiceMock: jasmine.SpyObj<TrainerService>;

  beforeEach(() => {
    trainerServiceMock = jasmine.createSpyObj('TrainerService', ['getTrainerId', 'levelUp']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FavoriteService,
        { provide: TrainerService, useValue: trainerServiceMock }
      ]
    });

    service = TestBed.inject(FavoriteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load favorites on initialization', () => {
    const mockFavorites = ['Pikachu', 'Charizard'];
    const mockUserId = 'trainer123';
    trainerServiceMock.getTrainerId.and.returnValue(mockUserId);

    service['loadFavorites']();

    const req = httpMock.expectOne(`http://localhost:4000/favorites/get-favorites?userId=${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ favorites: mockFavorites });

    expect(service.getFavorites()).toEqual(mockFavorites);
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(mockFavorites.length);
  });

  it('should add a favorite if not already in favorites', () => {
    service.addFavorite('Bulbasaur');

    expect(service.getFavorites()).toContain('Bulbasaur');
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(1);

    const req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    httpMock.verify();
  });

  it('should remove a favorite', () => {
    service['favorites'] = ['Pikachu', 'Charmander'];

    service.removeFavorite('Pikachu');
    expect(service.getFavorites()).toEqual(['Charmander']);
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(1);

    const req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    httpMock.verify();
  });

  it('should toggle a favorite', () => {
    service['favorites'] = ['Pikachu'];

    service.toggleFavorite('Charmander');
    expect(service.getFavorites()).toContain('Charmander');
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(2);

    let req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    service.toggleFavorite('Pikachu');
    expect(service.getFavorites()).toEqual(['Charmander']);
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(1);

    req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    httpMock.verify();
  });

  it('should clear all favorites', () => {
    service['favorites'] = ['Pikachu', 'Charmander'];

    service.clearFavorites();
    expect(service.getFavorites()).toEqual([]);
    expect(trainerServiceMock.levelUp).toHaveBeenCalledWith(0);

    const req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    httpMock.verify();
  });

  it('should check if a name is a favorite', () => {
    service['favorites'] = ['Pikachu', 'Charmander'];

    expect(service.isFavorite('Pikachu')).toBeTrue();
    expect(service.isFavorite('Bulbasaur')).toBeFalse();
  });

  it('should log an error if loading favorites fails', () => {
    const mockUserId = 'trainer123';
    trainerServiceMock.getTrainerId.and.returnValue(mockUserId);

    spyOn(console, 'error');

    service['loadFavorites']();
    
    const req = httpMock.expectOne(`http://localhost:4000/favorites/get-favorites?userId=${mockUserId}`);
    req.flush({ error: 'User not found' }, { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith('Erro ao carregar os favoritos', jasmine.any(Object));
  });

  it('should log an error if syncing favorites fails', () => {
    const mockUserId = 'trainer123';
    service['favorites'] = ['Pikachu'];

    trainerServiceMock.getTrainerId.and.returnValue(mockUserId);

    spyOn(console, 'error');

    service['syncFavorites']();

    const req = httpMock.expectOne('http://localhost:4000/favorites/sync-favorites');
    req.flush({ error: 'Sync failed' }, { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalledWith('Erro ao sincronizar favoritos no backend', jasmine.any(Object));
  });
});
