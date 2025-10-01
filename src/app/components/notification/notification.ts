import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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


export class NotificationComponent {
  @Input() message: string | null = null;
  @Input() type: 'error' | 'success' = 'success';
}
