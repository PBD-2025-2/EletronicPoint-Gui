import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/global-error-handler';
import { authinterceptor } from './interceptors/auth-interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authinterceptor, errorInterceptor]),
      withFetch()
    ),
    provideToastr(),

    // ErrorHandler global
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
