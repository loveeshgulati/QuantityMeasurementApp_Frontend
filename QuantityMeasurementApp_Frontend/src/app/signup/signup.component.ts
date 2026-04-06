import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  role = 'User';
  successMsg = '';
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    this.errorMsg = '';
    this.successMsg = '';
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }
    this.loading = true;
    this.auth.signup({ Name: this.name, Email: this.email, Password: this.password, Role: this.role }).subscribe({
      next: () => {
        this.successMsg = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        let msg = 'Signup failed. Try again.';
        if (err?.error?.errors) {
          const errors = err.error.errors;
          msg = Object.values(errors).flat().join(', ');
        } else if (err?.error?.title) {
          msg = err.error.title;
        } else if (err?.error?.message) {
          msg = err.error.message;
        } else if (err?.message) {
          msg = err.message;
        }
        this.errorMsg = msg;
        this.loading = false;
      }
    });
  }
}
