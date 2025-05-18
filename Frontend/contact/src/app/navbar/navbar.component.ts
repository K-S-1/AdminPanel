import { Component, inject } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService=inject(AuthServiceService)

  constructor( private router : Router) {}

  logout(): void {
    const key = this.loginService.getLoginData('token');
    if (key) {
      this.loginService.logoutData(key);
    }
    this.loginService.clearData(); // This clears all sessionStorage
    this.router.navigate(['/login-user']);  }
  
}
