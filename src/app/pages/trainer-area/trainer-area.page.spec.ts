import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { TrainerAreaPage } from './trainer-area.page';
import { Subject } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';
import { BehaviorSubject } from 'rxjs';
import { TrainerService } from 'src/app/services/trainer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrainerAreaPage', () => {
  let component: TrainerAreaPage;
  let fixture: ComponentFixture<TrainerAreaPage>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  const favoriteServiceMock = {
    favoritesChanged: new Subject<void>(),
    getFavorites: jasmine.createSpy('getFavorites').and.returnValue([]),
  };

  const trainerLevelSubject = new BehaviorSubject<number>(0);

  const trainerServiceMock = {
    trainerLevel$: trainerLevelSubject.asObservable(),
    getTrainerGender: () => 'male',
    getTrainerName: () => 'Ash',
    setTrainerGender: jasmine.createSpy('setTrainerGender'),
  };

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertSpy.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') } as any));

    await TestBed.configureTestingModule({
      declarations: [TrainerAreaPage],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AlertController, useValue: alertSpy },
        { provide: FavoriteService, useValue: favoriteServiceMock },
        { provide: TrainerService, useValue: trainerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerAreaPage);
    component = fixture.componentInstance;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set trainer image correctly', () => {
    component.setTrainerImage('male');
    expect(component.trainerImageUrl).toBe('assets/img/ash.png');

    component.setTrainerImage('female');
    expect(component.trainerImageUrl).toBe('assets/img/serena.png');
  });

  it('should display bronze medal for levels 1 to 15', async () => {
    trainerLevelSubject.next(10);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('.badge-bronze')).toBeTruthy();
    expect(el.querySelector('.badge-bronze')?.textContent).toContain('🥉 Bronze');
    expect(el.querySelector('.badge-silver')).toBeNull();
    expect(el.querySelector('.badge-gold')).toBeNull();
  });

  it('should display silver medal for levels 16 to 25', async () => {
    trainerLevelSubject.next(20);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('.badge-silver')).toBeTruthy();
    expect(el.querySelector('.badge-silver')?.textContent).toContain('🥈 Prata');
    expect(el.querySelector('.badge-bronze')).toBeNull();
    expect(el.querySelector('.badge-gold')).toBeNull();
  });

  it('should display gold medal for levels above 25', async () => {
    trainerLevelSubject.next(30);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('.badge-gold')).toBeTruthy();
    expect(el.querySelector('.badge-gold')?.textContent).toContain('🥇 Ouro');
    expect(el.querySelector('.badge-bronze')).toBeNull();
    expect(el.querySelector('.badge-silver')).toBeNull();
  });
});
