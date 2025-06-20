import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    localStorage.clear();
  });

  beforeEach(() => {
    service = TestBed.inject(FavoriteService);
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
    service = new FavoriteService(TestBed.inject(HttpTestingController) as any);

    expect(service.getFavorites()).toEqual(['pikachu']);
  });

  it('should return empty favorites if none saved', () => {
    expect(service.getFavorites()).toEqual([]);
  });

  it('should add favorite, save to localStorage and send webhook', () => {
    service.addFavorite('bulbasaur');

    expect(service.isFavorite('bulbasaur')).toBeTrue();
    expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).toContain('bulbasaur');

    const req = httpMock.expectOne(service['webhookUrl']);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ pokemon: 'bulbasaur', event: 'favorited' });
    req.flush({});
  });

  it('should not add duplicate favorite', () => {
    service.addFavorite('charmander');

    const req1 = httpMock.expectOne(service['webhookUrl']);
    req1.flush({});

    service.addFavorite('charmander');
    const reqs = httpMock.match(service['webhookUrl']);

    expect(reqs.length).toBe(0);
    expect(service.getFavorites().filter(f => f === 'charmander').length).toBe(1);
  });

  it('should remove favorite, update localStorage and send webhook', () => {
    service.addFavorite('squirtle');

    const reqAdd = httpMock.expectOne(service['webhookUrl']);
    reqAdd.flush({});

    service.removeFavorite('squirtle');

    expect(service.isFavorite('squirtle')).toBeFalse();
    expect(JSON.parse(localStorage.getItem('pokemon_favorites')!)).not.toContain('squirtle');

    const reqRemove = httpMock.expectOne(service['webhookUrl']);

    expect(reqRemove.request.body).toEqual({ pokemon: 'squirtle', event: 'unfavorited' });
    reqRemove.flush({});
  });

  it('should toggle favorite: add if not favorite', () => {
    service.toggleFavorite('eevee');

    expect(service.isFavorite('eevee')).toBeTrue();

    const req = httpMock.expectOne(service['webhookUrl']);

    expect(req.request.body.event).toBe('favorited');
    req.flush({});
  });

  it('should toggle favorite: remove if already favorite', () => {
    service.addFavorite('pikachu');

    const reqAdd = httpMock.expectOne(service['webhookUrl']);
    reqAdd.flush({});

    service.toggleFavorite('pikachu');

    expect(service.isFavorite('pikachu')).toBeFalse();

    const reqRemove = httpMock.expectOne(service['webhookUrl']);

    expect(reqRemove.request.body.event).toBe('unfavorited');
    reqRemove.flush({});
  });
});
