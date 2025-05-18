import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { UpdateContactComponent } from './update-contact/update-contact.component';
import { DeleteContactComponent } from './delete-contact/delete-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Import for Angular Animations
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component'; // <-- Import for API calls]
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { FormsModule } from '@angular/forms';
import { authInterceptorInterceptor } from './auth-interceptor.interceptor';
import { authGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { ProfileComponent } from './profile-view/profile-view.component';
import { GetAllComponent } from './get-all/get-all.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { EnvironmentService } from './environments/environment.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ForgotpasswordComponent,
    UpdateContactComponent,
    DeleteContactComponent,
    HomeComponent,
    NavbarComponent,
    ResetPasswordComponent,
    ViewContactComponent,
    ProfileComponent,
    GetAllComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    HttpClientModule, 
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [  
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptorInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useFactory: (envService: EnvironmentService) => ({
        siteKey: envService.recaptcha.siteKey,
      }),
      deps: [EnvironmentService]
    }
    
  ],
  
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AppModule { }
