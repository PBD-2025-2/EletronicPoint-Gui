import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
<<<<<<< HEAD
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/global-error-handler';

=======
import { authinterceptor } from './interceptors/auth-interceptor';
>>>>>>> 71cae37fc1d194a569347b08ec9321e60d5649b2

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    provideHttpClient(withFetch()),
<<<<<<< HEAD
    provideToastr(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
=======
    provideHttpClient(
      withInterceptors([authinterceptor])
    ), 
    provideToastr()
>>>>>>> 71cae37fc1d194a569347b08ec9321e60d5649b2
  ]
};
