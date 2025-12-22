import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) {}

  handleError(error: any): void {
    console.error('Global error:', error);
    //this.notificationService.showError(error.message || 'An unexpected error occurred');
  }
  
}
