// src/app/pages/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG modules
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/]/.test(value);
  const hasLength = value.length >= 12;
  return hasNumber && hasSymbol && hasLength ? null : { weakPassword: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  selectedRol: string | null = null;

  roles = [
    { label: 'Paciente', value: 'paciente' },
    { label: 'Enfermera', value: 'enfermera' },
    { label: 'Médico', value: 'médico' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private messageService: MessageService) {
    this.registerForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  rol: ['', Validators.required],
  nombre: ['', Validators.required],  
  password: ['', [Validators.required, passwordStrengthValidator]],
  especialidad: [''],
  contacto: [''],
  seguro: ['']
});

  }

  ngOnInit(): void {
    this.registerForm.get('rol')?.valueChanges.subscribe((rol) => {
      this.onRolChange(rol);
    });
  }

onRolChange(value: string): void {
  this.selectedRol = value;

  const especialidad = this.registerForm.get('especialidad');
  const nombre = this.registerForm.get('nombre');
  const contacto = this.registerForm.get('contacto');

  // Validaciones dinámicas
  if (value === 'médico') {
    especialidad?.setValidators([Validators.required]);
  } else {
    especialidad?.clearValidators();
    especialidad?.setValue('');
  }
  especialidad?.updateValueAndValidity();

  if (value === 'paciente') {
    nombre?.setValidators([Validators.required]);
    contacto?.setValidators([Validators.required]);
  } else {
    nombre?.clearValidators();
    contacto?.clearValidators();
    nombre?.setValue('');
    contacto?.setValue('');
  }
  nombre?.updateValueAndValidity();
  contacto?.updateValueAndValidity();
}


private registrarUsuario(payload: any, email: string, password: string): void {
  this.authService.register(payload).subscribe({
    next: () => {
      // ✅ Solo si el registro fue exitoso, hacemos login
      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          this.authService.setToken(res.access_token);
          this.authService.setRefreshToken(res.refresh_token);
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Redirigiendo a configuración MFA...',
            life: 3000
          });
          setTimeout(() => this.router.navigate(['/configurar-mfa']), 1500);
        },
        error: (err) => {
          console.error('Error al iniciar sesión después del registro:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Login fallido',
            detail: err.error?.message || 'No se pudo iniciar sesión automáticamente',
            life: 4000
          });
        }
      });
    },
    error: (err) => {
      console.error('Error en el registro:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el registro',
        detail: err.error?.message || 'No se pudo completar el registro',
        life: 4000
      });
    }
  });
}



onSubmit(): void {
  if (this.registerForm.valid) {
    const formValue = { ...this.registerForm.value };

    if (formValue.rol !== 'médico') formValue.especialidad = null;

    this.registrarUsuario(formValue, formValue.email, formValue.password);
  }
}


  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
