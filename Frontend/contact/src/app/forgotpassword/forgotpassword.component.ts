import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactServiceService } from '../service/contact-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: false,
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
})
export class ForgotpasswordComponent implements OnInit {
  forgotPwd!: FormGroup;
  message: string = '';
  isSubmitted: boolean = false;
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPwd = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.forgotPwd.markAllAsTouched();

    if (this.forgotPwd.invalid) {
      this.message = 'Please enter a valid email address.';
      this.isError = true;
      return;
    }

    this.isSubmitted = true;
    this.message = '';
    this.isError = false;

    const userEmail = this.forgotPwd.value.email;
    console.log('Submitting forgot password request for:', userEmail);

    this.contactService.forgotPassword(userEmail).subscribe({
      next: (response) => {
        console.log('Forgot password response:', response);

        if (response && response.resetLink) {
          try {
            // *** Extract token from the reset link ***
            const url = new URL(response.resetLink);
            const token = url.searchParams.get('token');

            if (token) {
              console.log('Extracted Token:', token);
              this.message = 'Reset link generated! Redirecting...';
              this.isError = false;

              setTimeout(() => {
                this.router.navigate(['/reset-password'], {
                  queryParams: { token: token },
                });
              }, 500);
            } else {
              console.error(
                'Token not found in reset link:',
                response.resetLink
              );
              this.message =
                'Received reset link, but could not extract token.';
              this.isError = true;
              this.isSubmitted = false; // Allow retry
            }
          } catch (e) {
            console.error('Error parsing reset link URL:', e);
            this.message =
              'Received an invalid reset link format from the server.';
            this.isError = true;
            this.isSubmitted = false; // Allow retry
          }
        } else {
          console.error('Invalid response structure received:', response);
          this.message =
            response.message ||
            response.error ||
            "Failed to get reset link. Response missing 'resetLink'.";
          this.isError = true;
          this.isSubmitted = false; // Allow retry
        }
      },
      error: (error) => {
        console.error('Error sending reset link:', error);
        this.isError = true;
        this.message = error.message || 'An unexpected error occurred.';
        this.isSubmitted = false; // Allow retry
      },
    });
  }
}
