import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    DefaultLoginLayout,
    ReactiveFormsModule,
    PrimaryInput
  ],
  providers: [
    AuthService,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {    
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.notificationService.showSuccess("Login finished sucessfully!")
        this.router.navigate(['/menu'])
      },

      error: (error) => {
        console.error('Login error details:', error); 
        this.notificationService.showError("An error has occured. Try again later")
      }
    })
  }
  
  navigate(){
    this.router.navigate(["signup"])
  }
}
