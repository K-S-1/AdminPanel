import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact';
import { animate, style, transition, trigger } from '@angular/animations';
import { ContactServiceService } from '../service/contact-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewContactComponent } from '../view-contact/view-contact.component';
import { UpdateContactComponent } from '../update-contact/update-contact.component';
import { DeleteContactComponent } from '../delete-contact/delete-contact.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-all',
  standalone: false,
  templateUrl: './get-all.component.html',
  styleUrl: './get-all.component.css',
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})

export class GetAllComponent implements OnInit {
  searchQuery: string = '';
  searchActive: boolean = false;
  cachedContacts: Contact[] = []; // Store original contacts for search filtering

  // Data state
  contacts: Contact[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Pagination parameters
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  isFirstPage: boolean = true;
  isLastPage: boolean = false;
  isEmpty: boolean = false;

  // Sorting parameters
  sortBy: string = 'name'; // Default sort by name for more intuitive experience
  sortDirection: string = 'ASC';

  constructor(
    private contactService: ContactServiceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.contactService.getAllData(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortDirection
    ).subscribe({
      next: (response: any) => {
        console.log("Received paginated contacts:", response);
        this.contacts = response.content;
        this.cachedContacts = [...response.content]; // Store original contacts
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.pageSize = response.size;
        this.isFirstPage = response.first;
        this.isLastPage = response.last;
        this.isEmpty = response.empty;
        
        // If there's an active search, apply filtering
        if (this.searchActive && this.searchQuery.trim()) {
          this.applySearchFilter();
        }

        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error fetching contacts:', err);
        this.error = err.message || 'Failed to load contacts. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    this.searchActive = query.length > 0;
    
    if (this.searchActive) {
      this.applySearchFilter();
    } else {
      // If search is cleared, restore original contacts
      this.contacts = [...this.cachedContacts];
      this.isEmpty = this.contacts.length === 0;
    }
  }
  
  applySearchFilter(): void {
    if (!this.searchQuery.trim()) {
      this.contacts = [...this.cachedContacts];
    } else {
      const query = this.searchQuery.trim().toLowerCase();
      this.contacts = this.cachedContacts.filter(contact =>
        (contact.name?.toLowerCase() || '').includes(query) ||
        (contact.userName?.toLowerCase() || '').includes(query) ||
        (contact.contactNumber?.toLowerCase() || '').includes(query)
      );
    }
  
    this.isEmpty = this.contacts.length === 0;
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.searchActive = false;
    this.contacts = [...this.cachedContacts];
    this.isEmpty = this.contacts.length === 0;
  }

  // Sorting functionality
  sort(column: string): void {
    if (this.sortBy === column) {
      // Toggle direction if clicking the same column
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Default to ASC when changing column
      this.sortBy = column;
      this.sortDirection = 'ASC';
    }
    
    // Clear search when sorting to avoid confusion
    if (this.searchActive) {
      this.clearSearch();
    }
    
    this.loadContacts();
  }

  // Get sort icon class
  getSortIconClass(column: string): string {
    if (this.sortBy !== column) {
      return 'bi bi-arrow-down-up text-muted ms-auto';
    }
    return this.sortDirection === 'ASC' 
      ? 'bi bi-sort-up text-primary ms-auto' 
      : 'bi bi-sort-down text-primary ms-auto';
  }

  // Page navigation methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadContacts();
    }
  }

  previousPage(): void {
    if (!this.isFirstPage) {
      this.currentPage--;
      this.loadContacts();
    }
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadContacts();
    }
  }

  firstPage(): void {
    if (!this.isFirstPage) {
      this.currentPage = 0;
      this.loadContacts();
    }
  }

  lastPage(): void {
    if (!this.isLastPage) {
      this.currentPage = this.totalPages - 1;
      this.loadContacts();
    }
  }

  // Change page size
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page when changing page size
    if (this.searchActive) {
      this.clearSearch(); // Clear search when changing page size
    }
    this.loadContacts();
  }

  // Modal methods
  openViewModal(contact: Contact): void {
    const modalRef = this.modalService.open(ViewContactComponent, {
      centered: true,
      size: 'md'
    });
    modalRef.componentInstance.contactToView = contact;
  }
  
  openUpdateModal(contact: Contact): void {
    const modalRef = this.modalService.open(UpdateContactComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg' // Larger modal for better readability
    });
    modalRef.componentInstance.contactToUpdate = { ...contact };
    
    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.showSuccessMessage('Contact updated successfully!');
          this.loadContacts();
        }
      },
      (reason) => {
        console.log(`Update modal dismissed: ${reason}`);
      }
    );
  }

  openDeleteModal(contact: Contact): void {
    const modalRef = this.modalService.open(DeleteContactComponent, {
      centered: true,
      size: 'md' // Slightly larger for better readability
    });
    modalRef.componentInstance.contactToDelete = contact;

    modalRef.result.then(
      (result) => {
        if (result === 'deleted') {
          this.showSuccessMessage('Contact deleted successfully!');
          this.loadContacts();
        }
      },
      (reason) => {
        console.log(`Delete modal dismissed: ${reason}`);
      }
    );
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    // Longer timeout for slower readers
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  
}