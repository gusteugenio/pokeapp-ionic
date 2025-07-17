import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and return a token', () => {
    const mockResponse = { token: 'fake-token', id: '123' };
    const credentials = { email: 'test@test.com', password: 'password123' };

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe('fake-token');
      expect(response.id).toBe('123');
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call register and return a success message', () => {
    const mockResponse = { message: 'User registered successfully' };
    const registerData = { username: 'testUser', email: 'test@test.com', password: 'password123', gender: 'M' };

    service.register(registerData).subscribe(response => {
      expect(response.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should save token in localStorage', () => {
    const token = 'fake-token';
    service.saveToken(token);

    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should get token from localStorage', () => {
    const token = 'fake-token';
    localStorage.setItem('token', token);

    const result = service.getToken();
    expect(result).toBe(token);
  });

  it('should logout and remove token from localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true when user is authenticated', () => {
    localStorage.setItem('token', 'fake-token');

    const result = service.isAuthenticated();
    expect(result).toBeTrue();
  });

  it('should return false when user is not authenticated', () => {
    localStorage.removeItem('token');

    const result = service.isAuthenticated();
    expect(result).toBeFalse();
  });
});
