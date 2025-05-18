import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Contact } from '../models/contact';
import { Login } from '../models/login';
import { LoginResponse } from '../models/LoginResponse';
import { AuthServiceService } from './auth-service.service';

interface ForgotPasswordRequest {
  userName: string;
}

interface ForgotPasswordResponse {
  resetLink: string;
  message?: string;
  error?: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  error?: string;
}

interface LoggedInAdmin {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactServiceService {
  private baseURl = '/adminPanel';
  private baseURlAU = '/auth';

  constructor(private http: HttpClient) {}

  authService = inject(AuthServiceService);

  getAllData(
    page: number,
    size: number,
    sortBy: string,
    direction: string
  ): Observable<any> {
    return this.http.get<any>(`${this.baseURl}/getAllUsers`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        sortBy,
        direction,
      },
    });
  }


  
  getLoggedInAdmin(): Observable<any> {
    const t = this.authService.getLoginData('token');
    if (t) {
      t: String;
      const token = t;
      return this.http
        .get(`${this.baseURl}/getLoggedInAdmin/${token}`)
        .pipe(catchError(this.handleError));
    } else {
      return throwError(() => new Error('No token available'));
    }
  }


  addUser(user: any): Observable<any> {
    return this.http
      .post(`${this.baseURl}/addUser`, user)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<string> {
    return this.http
      .delete(`${this.baseURl}/deleteUser/${id}`, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http
      .put(`${this.baseURl}/updateUser/${id}`, user)
      .pipe(catchError(this.handleError));
  }
  updateAdminDetails(data: any) {
    return this.http.put(`${this.baseURl}/updateAdminDetails`, data);
  }
  
  updateAdminImage(formData: FormData): Observable<any> {
    return this.http.put(`${this.baseURl}/updateAdminImage`, formData, {
      headers: new HttpHeaders({
        // ❌ Do NOT manually set content-type!
        // 'Content-Type': 'multipart/form-data',  <-- remove this
      })
    });
  }
  
  
  loginUser(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseURlAU}/login`, login).pipe(
      catchError(this.handleError) // Call the handleError method
    );
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    console.log(
      `Sending forgot password request to: ${this.baseURlAU}/forgotPassword`
    );
    const requestBody: ForgotPasswordRequest = { userName: email };
    return this.http
      .post<ForgotPasswordResponse>(
        `${this.baseURlAU}/forgotPassword`,
        requestBody,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  resetPassword(
    token: string,
    password: string
  ): Observable<ResetPasswordResponse> {
    console.log(
      `Sending reset password request to: ${this.baseURlAU}/resetPassword`
    );
    const requestBody: ResetPasswordRequest = { token, newPassword: password };
    return this.http
      .post<ResetPasswordResponse>(
        `${this.baseURlAU}/resetPassword`,
        requestBody,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error Object:', error);
    let errorMessage = 'An unknown error occurred. Please try again later.';
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    if (error.status === 0) {
      errorMessage = 'Could not connect to the server. Please check your network connection.';
    } else if (error.status === 404) {
      errorMessage = `Resource not found (404). Please check the API URL. (${error.url})`;
    } else if (error.status === 400 && !errorMessage.includes('required')) {
      errorMessage = `Invalid request (400). ${errorMessage}`;
    } else if (error.status === 500) {
      errorMessage = `Server error (500). Please contact support or try again later. ${errorMessage}`;
    }
    console.error(`Final Error Message: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}

