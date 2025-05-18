import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactServiceService } from '../service/contact-service.service';
import { Registration } from '../models/Registration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  router = inject(Router);

  registrationForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactServiceService
  ) {}


  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isActive: [true], // Initialize as true for every user as required
    });
  }
  get f() {
    return this.registrationForm.controls;
  }

  submittedForm() {
    this.submitSuccess = false;

    if (this.registrationForm.valid) {
      this.isSubmitting = true;

      const registrationData: Registration = this.registrationForm.value;

      this.contactService.registrationUser(registrationData).subscribe({
        next: (response) => {
          // if(response){
          //   sessionStorage.setItem('token','response.token');
          // }
          console.log('Contact added successfully:', response);
          this.submitSuccess = true;
          // this.registrationForm.reset();
          this.router.navigate(['/login-user']);
        },
        error: (error: Error) => {
          console.error('Error adding contact:', error);
        },
      });

      setTimeout(() => {
        console.log('Form submitted:', this.registrationForm.value);
        this.isSubmitting = false;
      }, 1500);
    }
    else{
      console.log("/////////////***registration not working****////////")
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
