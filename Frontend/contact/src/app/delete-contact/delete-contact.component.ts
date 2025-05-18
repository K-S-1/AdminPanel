import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../models/contact'; // Assuming the model for the backend is named Admin
import { ContactServiceService } from '../service/contact-service.service';

@Component({
  selector: 'app-delete-contact',
  standalone:false,
  templateUrl: './delete-contact.component.html',
  styleUrls: ['./delete-contact.component.css']
})
export class DeleteContactComponent {
  @Input() contactToDelete!: Contact; 
  isDeleting: boolean = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private contactService: ContactServiceService
) {}

  confirmDelete(): void {
    if (!this.contactToDelete || typeof this.contactToDelete.id === 'undefined') {
      this.error = 'Invalid contact data.';
      return;
    }

    this.isDeleting = true;
    this.error = null;

    this.contactService.deleteUser(this.contactToDelete.id).subscribe({
      next: () => {
        console.log('Deletion successful');
        this.isDeleting = false;
        this.activeModal.close('deleted'); // Notify parent component on success
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
        this.error = 'Failed to delete the contact. Please try again.';
        this.isDeleting = false;
      }
    });
  }

  dismiss(): void {
    this.activeModal.dismiss('cancel'); // Dismiss the modal without action
  }
}