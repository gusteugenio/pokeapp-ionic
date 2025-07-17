import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TrainerService } from 'src/app/services/trainer.service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let trainerServiceSpy: jasmine.SpyObj<TrainerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken']);
    trainerServiceSpy = jasmine.createSpyObj('TrainerService', [
      'setTrainerId',
      'getTrainerId',
      'loadTrainerInfo',
      'levelUp'
    ]);
    trainerServiceSpy.getTrainerId.and.returnValue('mock-user-id');
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TrainerService, useValue: trainerServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate to home on success', () => {
    const mockResponse = { token: 'test-token', id: 'trainer-id' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: component.email, password: component.password });
    expect(authServiceSpy.saveToken).toHaveBeenCalledWith('test-token');
    expect(trainerServiceSpy.setTrainerId).toHaveBeenCalledWith('trainer-id');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should display error message if login fails', () => {
    const mockError = 'Invalid credentials';
    authServiceSpy.login.and.returnValue(throwError(mockError));

    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    component.login();

    expect(component.error).toBe('Email ou senha inválidos. Verifique os dados e tente novamente.');
  });
});
