// src/app/components/totp-setup/totp-setup.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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

  constructor(private http: HttpClient) {}

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
    const body = { code: this.verifyingCode };
    this.http.post<any>('http://localhost:8000/auth/totp/verify', body).subscribe({
      next: (res) => {
        this.verificationStatus = '✅ Código verificado correctamente';
      },
      error: (err) => {
        console.error('Código inválido:', err);
        this.verificationStatus = '❌ Código inválido';
      }
    });
  }
}
