import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router } from '@angular/router'; // Optional: For navigation after success
import { ContactServiceService } from '../service/contact-service.service';
import { Contact } from '../models/contact';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-contact',
  standalone: false,
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'], // Use styleUrls instead of styleUrl
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // Fade in on enter
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        // Fade out on leave
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
    trigger('formState', [
      state(
        'initial',
        style({
          // Initial styles if needed
        })
      ),
      state(
        'submitting',
        style({
          opacity: 0.7, // Slightly fade the form while submitting
        })
      ),
      state(
        'submitted',
        style({
          // Styles after successful submission if needed (e.g., before navigating)
        })
      ),
      transition('* => submitting', animate('200ms ease-in')),
      transition('submitting => initial', animate('200ms ease-out')), // For error state
      transition('submitting => submitted', animate('200ms ease-out')), // For success state
    ]),
    trigger('feedbackSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class AddContactComponent implements OnInit {
  contactForm!: FormGroup; // Definite assignment assertion
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  formAnimationState: 'initial' | 'submitting' | 'submitted' = 'initial';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactServiceService,
    private router: Router // Optional
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      // Use Validators.pattern for more specific validation
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      landLineNo: ['', [Validators.pattern(/^\d{5,15}$/)]], 
      address: ['', [Validators.required, Validators.maxLength(200)]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  // --- Helper Getters for easier template access ---
  get name(): AbstractControl | null {
    return this.contactForm.get('name');
  }
  get mobileNo(): AbstractControl | null {
    return this.contactForm.get('mobileNo');
  }
  get landLineNo(): AbstractControl | null {
    return this.contactForm.get('landLineNo');
  }
  get address(): AbstractControl | null {
    return this.contactForm.get('address');
  }
  get pincode(): AbstractControl | null {
    return this.contactForm.get('pincode');
  }
  // ---

  onSubmit(): void {
    this.submitSuccess = false;
    this.submitError = null;
    this.contactForm.markAllAsTouched(); // Mark all fields as touched to show validation errors

    if (this.contactForm.invalid) {
      // Trigger shake animation or highlight invalid fields visually if desired
      console.log('Form is invalid');
      return;
    }

    this.isSubmitting = true;
    this.formAnimationState = 'submitting';
    const contactData: Contact = this.contactForm.value; // Type assertion can be risky if form != model exactly

    this.contactService
      .addData(contactData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          // Reset state only if it didn't succeed (error handles its own state reset)
          if (!this.submitSuccess) {
            this.formAnimationState = 'initial';
          }
        }) // Ensure isSubmitting is always reset
      )
      .subscribe({
        next: (response) => {
          console.log('Contact added successfully:', response);
          this.submitSuccess = true;
          this.formAnimationState = 'submitted';
          // this.contactForm.reset(); // Reset form fields

          // Optional: Keep the form to add another, just show success message
          setTimeout(() => {
            this.submitSuccess = false; 
            this.formAnimationState = 'initial';
            this.router.navigate(['/get-contact']);
          }, 2000); 
        },
        error: (error: Error) => {
          console.error('Error adding contact:', error);
          this.submitError =
            error.message ||
            'An unknown error occurred while adding the contact.';
          this.formAnimationState = 'initial';
         
        },
      });
  }

  // Helper to check if a field is invalid and touched/dirty
  isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
