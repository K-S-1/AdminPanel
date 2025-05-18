import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../models/contact';

@Component({
  selector: 'app-view-contact',
  standalone:false,
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent {
  @Input() contactToView!: Contact;

  constructor(public activeModal: NgbActiveModal) {}
}