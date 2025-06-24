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
      if (key === 'trainer_gender') return null;
      return null;
    });
    spyOn(localStorage, 'setItem').and.callFake(() => {});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(TrainerService);
    httpMock = TestBed.inject(HttpTestingController);
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

  it('should get and set trainer gender correctly', () => {
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'trainer_gender') return 'male';
      return null;
    });
    expect(service.getTrainerGender()).toBe('male');

    service.setTrainerGender('female');
    expect(localStorage.setItem).toHaveBeenCalledWith('trainer_gender', 'female');
  });
});
