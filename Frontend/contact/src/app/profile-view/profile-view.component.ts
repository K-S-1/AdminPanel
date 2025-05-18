import { Component, inject, OnInit } from '@angular/core';
import { ContactServiceService } from '../service/contact-service.service';
import { Contact } from '../models/contact';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServiceService } from '../service/auth-service.service';

@Component({
  selector: 'app-profile',
  standalone: false,
    templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileComponent implements OnInit {
  adminDetails: Contact = {
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
    isActive: true
  };
  isLoading = true;
  isEditing = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedImage: File | null = null;

  constructor(private contactService: ContactServiceService) {}

  authService = inject(AuthServiceService);
  key = this.authService.getLoginData('token');

  ngOnInit(): void {
    this.fetchAdminDetails();
  }

  fetchAdminDetails(): void {
    this.contactService.getLoggedInAdmin().subscribe({
      next: (response) => {
        if (response.dob) {
          const [day, month, year] = response.dob.split('/');
  
          const fullYear = year.length === 2 ? '19' + year : year;
  
          response.dob = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
  
        this.adminDetails = response;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching admin details:', err);
        this.errorMessage = 'Failed to load admin details.';
        this.isLoading = false;
      }
    });
  }


  // updateProfile(): void {
  //   const formData = new FormData();
  //   // formData.append('adminDetails', this.adminDetails);
  
  //   if (this.selectedImage) {
  //     formData.append('profileImage', this.selectedImage);
  //   }
  
  //   this.contactService.updateAdminProfile(formData,this.adminDetails).subscribe({
  //     next: () => {
  //       this.successMessage = 'Profile updated successfully!';
  //       this.isEditing = false;
  //       this.fetchAdminDetails();
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.error('Error updating profile:', err);
  //       this.errorMessage = 'Failed to update profile. Please try again.';
  //     }
  //   });
  // }
  
  updateProfile() {
    const formData = {
      name: this.adminDetails.name,
      dob: this.adminDetails.dob,
      gender: this.adminDetails.gender,
      address: this.adminDetails.address,
      contactNumber: this.adminDetails.contactNumber,
      pinCode: this.adminDetails.pinCode,
      userName: this.adminDetails.userName
    };
  
    this.contactService.updateAdminDetails(formData).subscribe(
      (res: any) => {  // 👈 quick fix
        this.successMessage = res.message;
        this.uploadImage();
      },
      err => {
        this.errorMessage = 'Failed to update details';
      }
    );
    
  }
  
  uploadImage() {
    if (!this.selectedImage) return;
  
    const imageData = new FormData();
    imageData.append('userName', this.adminDetails.userName);
    imageData.append('profileImage', this.selectedImage);
  
    this.contactService.updateAdminImage(imageData).subscribe(
      (res: any)  => {
        this.successMessage = res.message;
      },
      err => {
        this.errorMessage = 'Failed to upload image';
      }
    );
  }
  
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    const words = name.trim().split(' ');
    const first = words[0]?.charAt(0).toUpperCase() || '';
    const last = words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';
    return first + last;
  }
}