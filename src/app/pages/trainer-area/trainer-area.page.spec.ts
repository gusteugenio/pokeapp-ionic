import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { TrainerAreaPage } from './trainer-area.page';
import { Subject } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';

describe('TrainerAreaPage', () => {
  let component: TrainerAreaPage;
  let fixture: ComponentFixture<TrainerAreaPage>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  const favoriteServiceMock = {
    favoritesChanged: new Subject<void>(),
    getFavorites: jasmine.createSpy('getFavorites').and.returnValue([]),
  };

  beforeEach(async () => {
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertSpy.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') }));

    await TestBed.configureTestingModule({
      declarations: [TrainerAreaPage],
      providers: [
        { provide: AlertController, useValue: alertSpy },
        { provide: FavoriteService, useValue: favoriteServiceMock },
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

  it('should present gender selection alert', async () => {
    await component.presentGenderSelection();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
});
