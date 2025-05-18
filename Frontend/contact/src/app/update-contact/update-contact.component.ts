import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Contact } from '../models/contact'; // Assuming the model for the backend is named Admin
import { ContactServiceService } from '../service/contact-service.service';

@Component({
  selector: 'app-update-contact',
  standalone:false,
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.css']
})
export class UpdateContactComponent implements OnInit {
  @Input() contactToUpdate!: Contact;
  currentContact: Contact = {
    id: 0,
    name: '',
    dob: '',
    userName: '',
    password: '',
    gender: '',
    address: '',
    profileImage: '',
    profileContentType: '',
    contactNumber: '',
    pinCode: 0,
    accessRole: '',
    resetPasswordToken: '',
    isActive: false
  };
  isSaving: boolean = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
 private contactService: ContactServiceService
  ) {}

  ngOnInit(): void {
    if (this.contactToUpdate) {
      this.currentContact = { ...this.contactToUpdate };
    } else {
      this.error = 'No contact data available for editing.';
    }
  }

  onSubmit(updateForm: NgForm): void {
    if (updateForm.invalid) {
      Object.values(updateForm.controls).forEach((control) => control.markAsTouched());
      this.error = 'Please fix the errors in the form.';
      return;
    }

    this.isSaving = true;
    this.error = null;

    this.contactService.updateUser(this.currentContact.id, this.currentContact).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.isSaving = false;
        this.activeModal.close('updated');
      },
      error: (err) => {
        console.error('Error updating contact:', err);
        this.error = 'Failed to update contact. Please try again.';
        this.isSaving = false;
      }
    });
  }

  dismiss(): void {
    this.activeModal.dismiss('cancel');
  }
}