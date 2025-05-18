import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { UpdateContactComponent } from './update-contact/update-contact.component';
import { DeleteContactComponent } from './delete-contact/delete-contact.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { ProfileComponent } from './profile-view/profile-view.component';
import { GetAllComponent } from './get-all/get-all.component';

const routes: Routes = [{path:'', component:HomeComponent},
  {path:'view-contact', component:ViewContactComponent,canActivate:[authGuard]},
  {path:'update-contact', component:UpdateContactComponent,canActivate:[authGuard]},
  {path:'delete-contact', component:DeleteContactComponent,canActivate:[authGuard]},
  {path:'get-contact', component:GetAllComponent,canActivate:[authGuard]},
  {path:'login-user', component:LoginComponent},
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile-view', component: ProfileComponent },
  {path:'home', component:HomeComponent},
  {path:'**', component:ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forChild(routes)], // what is this???
  exports: [RouterModule]
})
export class AppRoutingModule { }
