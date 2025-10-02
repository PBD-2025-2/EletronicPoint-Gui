import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/global-error-handler';
import { authinterceptor } from './interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    provideHttpClient(withInterceptors([authinterceptor])),
    provideHttpClient(withFetch()),
    provideToastr(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
