import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { adminAuthGuard } from './admin-auth.guard';

describe('adminAuthGuard', () => {
  let httpTesting: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpTesting.verify());

  it('allows a request when the server confirms an admin session', () => {
    let result: unknown;
    const guardResult = TestBed.runInInjectionContext(() =>
      adminAuthGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as RouterStateSnapshot)
    );
    if (!(guardResult instanceof Observable)) {
      throw new Error('Expected the guard to return an observable.');
    }
    guardResult.subscribe(value => result = value);

    httpTesting.expectOne('/api/admin/session').flush(null);

    expect(result).toBe(true);
  });

  it('redirects unauthenticated users to the password form', () => {
    let result: unknown;
    const guardResult = TestBed.runInInjectionContext(() =>
      adminAuthGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as RouterStateSnapshot)
    );
    if (!(guardResult instanceof Observable)) {
      throw new Error('Expected the guard to return an observable.');
    }
    guardResult.subscribe(value => result = value);

    httpTesting.expectOne('/api/admin/session').flush(null, {
      status: 401,
      statusText: 'Unauthorized'
    });

    expect(result).toEqual(router.parseUrl('/admin/login?returnUrl=%2Fadmin'));
  });
});
