import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@NgModule({
  exports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule
  ]
})
export class PrimeNgModule {}
