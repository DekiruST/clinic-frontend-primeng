# Clinic Frontend PrimeNG

Este es el frontend del sistema de gestión clínica desarrollado con **Angular 19** y **PrimeNG**. Contiene las vistas de **Login** y **Register** bajo el módulo de autenticación.

## 🚀 Tecnologías utilizadas

- Angular 19
- PrimeNG
- PrimeIcons
- @angular/animations
- CSS3


## 📁 Estructura de Carpetas

clinic-frontend-primeng/
├── src/
│ ├── app/
│ │ ├── pages/
│ │ │ └── auth/
│ │ │ ├── login/
│ │ │ │ ├── login.component.ts
│ │ │ │ ├── login.component.html
│ │ │ │ └── login.component.css
│ │ │ └── register/
│ │ │ ├── register.component.ts
│ │ │ ├── register.component.html
│ │ │ └── register.component.css
│ ├── assets/
│ │ └── ... (temas, fuentes y recursos)
│ └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
└── README.md

yaml
Copiar
Editar


## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio
git clone https://github.com/DekiruST/clinic-frontend-primeng.git
cd clinic-frontend-primeng

### 2. Instalar Angular CLI 19
npm install -g @angular/cli

### 3. Instalar dependencias del proyecto
npm install
Si estás utilizando Angular 19 y ocurre un conflicto de dependencias con PrimeNG, usa el siguiente comando:
npm install primeng@17 primeicons @angular/animations --save --force

### 4. Ejecutar el servidor de desarrollo
ng serve
Luego abre tu navegador en:
http://localhost:4200

### 📦 Dependencias principales
@angular/core@19.x

@angular/cli@19.x

@angular/animations

primeng@17.x

primeicons

zone.js