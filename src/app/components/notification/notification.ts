import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="notification-box" [ngClass]="type">
      {{ message }}
    </div>
  `,
  styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnDestroy {
  message: string | null = null;
  type: 'error' | 'success' = 'error';
  private subscription = new Subscription();

  constructor(private notificationService: NotificationService) {
    this.subscription.add(
      this.notificationService.error$.subscribe(msg => {
        this.type = 'error';
        this.message = msg;
        this.resetAfterDelay();
      })
    );

    this.subscription.add(
      this.notificationService.success$.subscribe(msg => {
        this.type = 'success';
        this.message = msg;
        this.resetAfterDelay();
      })
    );
  }

  private resetAfterDelay() {
    setTimeout(() => (this.message = null), 4000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
