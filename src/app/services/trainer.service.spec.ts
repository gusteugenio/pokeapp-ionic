import { TestBed } from '@angular/core/testing';
import { TrainerService } from './trainer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Atenção: Ao descomentar o uso do webhook, os testes irão falhar se esperar por alguma chamada.
describe('TrainerService', () => {
  let service: TrainerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'trainer_level') return '0';
      if (key === 'trainer_gender') return 'male';
      if (key === 'trainer_id') return '123';
      return null;
    });
    spyOn(localStorage, 'setItem').and.callFake(() => {});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(TrainerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should level up every 5 favorited pokemons', () => {
    service.levelUp(0);
    expect(service.getCurrentLevel()).toBe(0);

    service.levelUp(4);
    expect(service.getCurrentLevel()).toBe(0);

    service.levelUp(5);
    expect(service.getCurrentLevel()).toBe(1);

    service.levelUp(11);
    expect(service.getCurrentLevel()).toBe(2);

    service.levelUp(23);
    expect(service.getCurrentLevel()).toBe(4);

    service.levelUp(25);
    expect(service.getCurrentLevel()).toBe(5);
  });

  it('should not exceed max level', () => {
    service.levelUp(500);
    expect(service.getCurrentLevel()).toBe(50);
  });

  it('should save level to localStorage when leveling up', () => {
    service.levelUp(5);
    expect(localStorage.setItem).toHaveBeenCalledWith('trainer_level', '1');
  });

  it('should load trainer info from backend and set it correctly', () => {
    const mockResponse = { username: 'Maria', gender: 'female' };

    service.loadTrainerInfo();

    const req = httpMock.expectOne('http://localhost:4000/trainer/get-trainer-info?userId=123'); // O userId agora é '123'
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.getTrainerName()).toBe('Maria');
    expect(service.getTrainerGender()).toBe('female');
  });
});
