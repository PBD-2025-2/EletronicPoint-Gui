import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss',
})
export class App {
  errorMessage: string | null = null;
  successMessage: string | null = null;

}
