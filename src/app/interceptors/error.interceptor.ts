import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred.';

      if (error.error) {
        if (typeof error.error === 'string') {
          message = error.error;
        } else if (error.error.message) {
          message = error.error.message; // Read the ErrorResponse
        } else if (error.error.error) {
          message = error.error.error;
        }
      }

      if (error.status === 0) {
        message = 'Unable to connect to the server.';
      }

      notificationService.showError(message);
      // Test
      console.log("BACK RESPONSE FULL:", error);
      console.log("BACK MESSAGE:", error.error?.message);

      return throwError(() => new Error(message));
    })
  );
};
