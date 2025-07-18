// clinic-frontend-primeng/src/app/components/totp-setup/totp-setup.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth.service'; 

// ✅ Definición fuera del componente
interface JwtPayload {
  rol: string;
  [key: string]: any;
}

@Component({
  selector: 'app-totp-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './totp-setup.component.html',
  styleUrls: ['./totp-setup.component.css']
})
export class TotpSetupComponent implements OnInit {
  secret: string = '';
  otpUrl: string = '';
  qrImageSrc: string = '';
  verifyingCode: string = '';
  verificationStatus: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  generarTOTP(): void {
    this.http.post<any>('http://localhost:8000/auth/totp/generate', {}).subscribe({
      next: (res) => {
        this.secret = res.secret;
        this.otpUrl = res.otp_url;
        this.qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.otpUrl)}&size=250x250`;
        this.verificationStatus = '';
      },
      error: (err) => {
        console.error('Error generando TOTP:', err);
        this.verificationStatus = 'Error al generar TOTP';
      }
    });
  }

  verificarCodigo(): void {
    this.verificationStatus = '';

    const code = this.verifyingCode.trim();
    if (!/^\d{6}$/.test(code)) {
      this.verificationStatus = '❌ Ingresa un código de 6 dígitos válido';
      return;
    }

    const body = { code };
    this.http.post<any>('http://localhost:8000/auth/totp/verify', body).subscribe({
      next: (res) => {
        this.verificationStatus = '✅ Código verificado correctamente';
        console.log('Token recibido:', res.access_token);
        this.authService.setToken(res.access_token); // ✅ Guardar con clave correcta
        console.log('TOKEN GUARDADO:', res.access_token);

        const rolCrudo = this.getRolFromToken();
        console.log('Rol decodificado:', rolCrudo);

        const rol = rolCrudo?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        console.log('Rol detectado:', rol);

        switch (rol) {
          case 'paciente':
            this.router.navigate(['/paciente']);
            break;
          case 'medico':
            this.router.navigate(['/medico']);
            break;
          case 'enfermera':
            this.router.navigate(['/enfermera']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Código inválido';
        this.verificationStatus = `❌ ${msg}`;
        console.error('Código inválido:', err);
      }
    });
  }

  getRolFromToken(): string | null {
    const token = localStorage.getItem('access_token'); // ✅ usar access_token
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.rol || null;
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }
}
