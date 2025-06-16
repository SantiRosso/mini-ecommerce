import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    // Reset forms when switching modes
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formData = this.loginForm.value;

      console.log('Login data:', formData);

      // Simular llamada al servicio
      setTimeout(() => {
        this.isLoading = false;
        // Aquí harías la llamada real al servicio
        // this.authService.login(formData).subscribe(...)

        // Por ahora, simplemente navegar al home
        this.router.navigate(['/products']);
      }, 1500);
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;

      console.log('Register data:', formData);

      // Simular llamada al servicio
      setTimeout(() => {
        this.isLoading = false;
        // Aquí harías la llamada real al servicio
        // this.authService.register(formData).subscribe(...)

        // Por ahora, cambiar a modo login después del registro
        this.isLoginMode = true;
        this.registerForm.reset();
      }, 1500);
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }

    if (field?.hasError('email')) {
      return 'Ingresa un email válido';
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    if (field?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'firstName': 'Nombre',
      'lastName': 'Apellido',
      'email': 'Email',
      'password': 'Contraseña',
      'confirmPassword': 'Confirmar contraseña'
    };

    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }
}
