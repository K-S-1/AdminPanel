import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthServiceService } from "./service/auth-service.service";
 
export class authInterceptorInterceptor implements HttpInterceptor{
        // console.log(req.url);
        // return next(req);
        constructor()
        {
            console.log('in interceptor....')
        }
 
        loginService=inject(AuthServiceService)
       
        intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            let currentUser = this.loginService.getLoginData('token');
            console.log("current user==>"+currentUser)
            // let currentUserEmail = this.loginService.getLoginData('uname');
            // console.log("current user email==>"+currentUserEmail)
             // Method to get the JWT token
             console.log("in interceptor...");
             
            if (currentUser) {
              request = request.clone({
                setHeaders: {
                  'Authorization': `Bearer ${currentUser}`,
                  // 'Content-Type': 'application/json', // You can add other headers if necessary
                }
              });
            }
            return next.handle(request);
          }
}
 