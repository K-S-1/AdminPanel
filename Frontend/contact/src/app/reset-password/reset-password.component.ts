import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ContactServiceService } from '../service/contact-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  message: string = '';
  isSubmitted: boolean = false;
  isError: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  ngForm!: NgForm;
  captchatoken: string | null | undefined;


  constructor(
    private fb: FormBuilder,
    private contactService: ContactServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.captchatoken = undefined;
  }

  get f() {
    return this.resetForm.controls;
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      recaptcha: ['', Validators.required]

    }, { validator: this.passwordMatchValidator });

    // Get token from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.isError = true;
        this.message = "Invalid or expired password reset link. Please request a new one.";
      }
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getPasswordStrength(): number {
    const password = this.resetForm.get('password')?.value || '';
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    strength += Math.min(password.length * 5, 30);
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 15; // Has uppercase
    if (/[a-z]/.test(password)) strength += 10; // Has lowercase
    if (/[0-9]/.test(password)) strength += 15; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Has special char
    
    // Variety check
    const uniqueChars = new Set(password).size;
    strength += Math.min(uniqueChars * 2, 10);
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 30) return '#f56565'; // Weak - red
    if (strength < 60) return '#ed8936'; // Fair - orange
    if (strength < 80) return '#ecc94b'; // Good - yellow
    return '#48bb78'; // Strong - green
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  }

  onSubmit(): void {
    this.resetForm.markAllAsTouched();
    
    if (this.resetForm.invalid || !this.token) {
      return;
    }
    
    this.isSubmitted = true;
    this.message = '';
    this.isError = false;
    
    this.contactService
      .resetPassword(this.token, this.resetForm.value.password)
      .subscribe({
        next: (response) => {
          this.message = "Password reset successful! You can now login with your new password.";
          setTimeout(() => {
            this.router.navigate(['/login-user']);
          }, 1000);
        },
        error: (error) => {
          this.isError = true;
          this.message = error.message || "Failed to reset password. Link may have expired.";
          console.error('Error resetting password:', error);
          this.isSubmitted = false;
        },
        complete: () => {
          this.isSubmitted = false;
        }
      });
  }

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.captchatoken}] generated`);
  }
}
