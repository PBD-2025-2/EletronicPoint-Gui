import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../components/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInput } from '../../components/primary-input/primary-input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';



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
    private toastService: ToastrService) {    
    this.loginForm = new FormGroup({
<<<<<<< HEAD
      email: new FormControl('', [Validators.required, Validators.email]),
=======

      email: new FormControl(''),
>>>>>>> 71cae37fc1d194a569347b08ec9321e60d5649b2
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.toastService.success("Login finished sucessfully!")
        this.router.navigate(['/menu'])
      },
      error: (error) => {
        console.error('Login error details:', error); 
        this.toastService.error("An error has occured. Try again later")
      }
    })
  }

  navigate(){
    this.router.navigate(["signup"])
  }
}
