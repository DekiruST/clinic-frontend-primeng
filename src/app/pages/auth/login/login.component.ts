import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';

// PrimeNG modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface JwtPayload {
  rol: string;
  [key: string]: any;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
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
        // Login inicial sin TOTP
        this.authService.loginInit(email, password).subscribe({
          next: (res: { mfa_required: boolean; access_token: string }) => {
            if (res.mfa_required) {
              this.authService.setToken(res.access_token);
              this.router.navigate(['/configurar-mfa']);
            }
          },
          error: (err) => {
            if (err.status === 403) {
              // MFA ya está configurado, continuar al login completo
              this.realLogin(email, password, totp_code);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de inicio de sesión',
                detail: err.error?.message || 'Error de login',
                life: 4000
              });
            }
          }
        });
      } else {
        this.realLogin(email, password, totp_code);
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa los campos requeridos',
        life: 3000
      });
    }
  }

  realLogin(email: string, password: string, totp_code: string): void {
    this.authService.login({ email, password, totp_code }).subscribe({
      next: (res) => {
        this.authService.setToken(res.access_token);
        this.authService.setRefreshToken(res.refresh_token);
        this.messageService.add({
          severity: 'success',
          summary: 'Login exitoso',
          detail: 'Bienvenido/a',
          life: 2000
        });
        this.procesarRedireccionDesdeToken();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error MFA',
          detail: err.error?.message || 'Código TOTP inválido o credenciales incorrectas',
          life: 4000
        });
      }
    });
  }

  private procesarRedireccionDesdeToken(): void {
   const token = localStorage.getItem('access_token'); 

    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const rol = decoded.rol;

      switch (rol) {
        case 'paciente':
          this.router.navigate(['/paciente/dashboard-paciente']);
          break;
        case 'enfermera':
          this.router.navigate(['/enfermera/dashboard-enfermera']);
          break;
        case 'médico':
          this.router.navigate(['/medico/dashboard-medico']);
          break;
        case 'admin':
          this.router.navigate(['/dashboard-admin']);
          break;
        default:
          this.router.navigate(['/']);
      }
    } catch {
      this.router.navigate(['/']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
