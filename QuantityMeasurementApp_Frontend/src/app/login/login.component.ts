import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';
    if (!this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}
