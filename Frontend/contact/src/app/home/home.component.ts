import { Component, OnInit, OnDestroy } from '@angular/core';
import { WOW } from 'wowjs'; // Import WOW

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy {

  // Declare wow instance variable
  private wowInstance: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize WOW.js when the component mounts
    // Use 'any' type assertion as WOW constructor might not have perfect typings
    this.wowInstance = new (WOW as any)({
      boxClass:     'wow',      // default
      animateClass: 'animate__animated', // default - Make sure it matches animate.css
      offset:       0,          // default
      mobile:       true,       // default
      live:         true        // default - keep checking for new wow elements
    });
    this.wowInstance.init();
  }

  ngOnDestroy(): void {
    // Optional: Clean up if necessary, though WOW usually handles itself
    // If you face issues with navigation and animations re-triggering oddly,
    // you might need more specific cleanup here.
  }
}