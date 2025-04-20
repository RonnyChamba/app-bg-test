import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  constructor(private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly router: Router,
              private readonly fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    
    if (this.loginForm.valid) {
     
      const loginDTO = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      console.log('LoginDTO', loginDTO);

      this.authService.login(loginDTO)
      .pipe(
        tap((response) => {
          if (response && response.data) {
            this.tokenService.setToken(response.data);
            this.router.navigate(['/home']);
          } else {
            console.error('Token not found in response');
            alert('Login failed: Token not found');
          }

        }
        ),
        catchError((error) => {
          console.error('Error during login', error);
          alert('Login failed: ');
          return of(error);
        })
      ).subscribe();
     


    } else {
      console.log('Formulario inválido');
      alert('Formulario inválido');
    }
  }
}
