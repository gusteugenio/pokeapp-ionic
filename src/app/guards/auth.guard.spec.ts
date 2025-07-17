import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let guard: AuthGuard;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
