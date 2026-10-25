import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  password = '';
  submitting = signal(false);
  errorMessage = signal('');

  constructor(
    private auth: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.route.snapshot.queryParamMap.get('reason') === 'unavailable') {
      this.errorMessage.set('Admin sign-in is temporarily unavailable. Please try again later.');
    }
  }

  onSubmit() {
    if (!this.password || this.submitting()) return;

    this.submitting.set(true);
    this.errorMessage.set('');
    this.auth.login(this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin');
      },
      error: error => {
        this.errorMessage.set(error.status === 401 || error.status === 403
          ? 'That password was not accepted.'
          : 'Unable to sign in right now. Please try again.');
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false)
    });
  }
}
