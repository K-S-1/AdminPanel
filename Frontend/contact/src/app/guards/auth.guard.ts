import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthServiceService);
  let router = inject(Router);
  let key = authService.getLoginData('token');

  if ((key == null)) {
    console.log("AuthGuard checking token =", key);
    router.navigate(['/login-user']);
    return false;
  }
  return true;
};

//   import { inject, Injectable } from '@angular/core';
// import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Router } from '@angular/router';
// import { GetContactComponent } from '../get-contact/get-contact.component';
// import { AuthServiceService } from '../service/auth-service.service';

//   @Injectable({
//     providedIn: 'root'
//   })
//   export class AuthGuard implements CanActivate, CanActivateChild,CanDeactivate<GetContactComponent>, CanLoad  {
//     constructor(private router: Router) {}

//     authService=inject(AuthServiceService)
//     key = this.authService.getLoginData('token');

//     if(key = null){
//       this.router.navigate(['/login-user']);
//     }

//     canActivate(): boolean {
//       return this.checkAuth();
//     }

//     canActivateChild(): boolean {
//       return this.checkAuth();
//     }

//     canDeactivate(component: GetContactComponent): boolean {
//       if (component.hasUnsavedChanges()) {
//         return window.confirm('You have unsaved changes. Do you really want to leave?');
//       }
//       return true;
//     }

//     canLoad(): boolean {
//       return this.checkAuth();
//     }

//     private checkAuth(): boolean {
//       if (this.authService.isAuthenticatedUser()) {
//         return true;
//       } else {
//         // Redirect to the login page if the user is not authenticated
//         this.router.navigate(['/login-user']);
//         return false;
//       }
//     }

//   }
