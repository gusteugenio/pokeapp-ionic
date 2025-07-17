import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate to login on success', () => {
    const mockResponse = { message: 'Usuário registrado com sucesso!' };
    authServiceSpy.register.and.returnValue(of(mockResponse));

    component.username = 'testUser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.gender = 'male';

    component.register();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: component.username,
      email: component.email,
      password: component.password,
      gender: component.gender
    });

    expect(component.success).toBe('Usuário registrado com sucesso!');
  });

  it('should display error message if register fails', () => {
    const mockError = 'Email já está em uso';
    authServiceSpy.register.and.returnValue(throwError(mockError));

    component.username = 'testUser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.gender = 'male';

    component.register();

    expect(component.error).toBe('Não foi possível concluir o cadastro. Verifique se o email já está em uso ou se os dados estão corretos.');
    expect(component.success).toBe('');
  });
});
