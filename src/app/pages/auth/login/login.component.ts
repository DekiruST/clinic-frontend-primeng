import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
       totp_code: ['']
    });
  }

onSubmit(): void {
  if (this.loginForm.valid) {
    const { email, password, totp_code } = this.loginForm.value;

    if (!totp_code || totp_code.trim() === '' || totp_code === '000000') {
      // 1️⃣ Si no hay TOTP → loginInit
      console.log('Iniciando loginInit con:', email, password);
      this.authService.loginInit(email, password).subscribe({
        next: (res) => {
          console.log('Respuesta de loginInit:', res);
          if (res.mfa_required) {
            this.authService.setToken(res.access_token);
            this.router.navigate(['/configurar-mfa']);
          }
        },
        error: (err) => {
          console.error('Error loginInit:', err);
          if (err.status === 403) {
            console.log('MFA ya configurado, redirigiendo a realLogin');
            this.realLogin(email, password, totp_code); // Código ya puede estar presente
          } else {
            alert(err.error?.message || 'Error de login');
          }
        }
      });
    } else {
      // 2️⃣ Si hay TOTP → realLogin directamente
      this.realLogin(email, password, totp_code);
    }

  } else {
    console.warn('Formulario inválido');
  }
}


realLogin(email: string, password: string, totp_code: string): void {
  this.authService.login({ email, password, totp_code }).subscribe({
    next: (res) => {
      console.log('Login MFA exitoso:', res);
      this.authService.setToken(res.access_token);
      this.authService.setRefreshToken(res.refresh_token);
      this.procesarRespuesta(res); // ✅ Redirige según el rol
    },
    error: (err) => {
      console.error('Error login MFA:', err);
      alert(err.error?.message || 'Código TOTP inválido o credenciales incorrectas');
    }
  });
}
private procesarRespuesta(res: any): void {
  this.authService.setToken(res.access_token);
  this.authService.setRefreshToken(res.refresh_token);

  const rol = res.user?.rol;

  if (rol === 'paciente') {
    this.router.navigate(['/paciente']);
  } else if (rol === 'enfermera') {
    this.router.navigate(['/enfermera']);
  } else if (rol === 'médico') {
    this.router.navigate(['/medico']);
  } else {
    this.router.navigate(['/']);
  }
}


goToRegister(): void {
  this.router.navigate(['/register']);
}

}
