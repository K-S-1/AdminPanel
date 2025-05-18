# 🛠️ Admin Panel Console

A full-stack **Admin Panel Console** built with an **Angular** frontend and **Spring Boot** backend.  
This project demonstrates secure **role-based access**, efficient **user management**, and a clean, responsive **dashboard interface**, incorporating best practices in modern web development.

---

## 🌟 Key Highlights

- 🔐 **JWT Authentication**: Secure login with role-based access control  
- 🛡️ **Auth Guard & Interceptor**: Route protection and token injection for API communication  
- 📋 **User Management**: Paginated user list with search, view, edit, and delete functionality  
- 🤖 **Google reCAPTCHA Integration**: Protection on login and password recovery pages  
- 📱 **Responsive Design**: Sleek, mobile-friendly UI built with Angular Material  
- ⚙️ **Global Error Handling**: Clean backend architecture with consistent validation and exception management  

---

## 🚀 Features

### 🔐 Authentication & Security
- Login with JWT-based session authentication
- Role-based access control for admin privileges
- Google reCAPTCHA on **Login** and **Forgot Password** pages
- Secure logout functionality
- 🔐 **Auth Guard** to protect private routes
- 📦 **HTTP Interceptor** for automatic JWT injection in API requests

### 🖥️ Admin Dashboard
- Display of logged-in admin's profile info and image/avatar
- Top menu bar with navigation links (Dashboard, User List, Logout)
- Wildcard route handler for invalid paths (custom 404 page)

### 👥 User Management
- View list of all registered users
- Backend-powered **pagination** and **sorting**
- **Search functionality** to filter users by keyword
- Action buttons: **View**, **Edit**, **Delete** for each user

### ✅ Validations & Error Handling
- Angular form validations (client-side)
- Spring Boot bean validations (server-side)
- Global exception handling with meaningful error messages

---

## 🛠️ Technology Stack

### 🎨 Frontend
| Tool              | Description                                |
|-------------------|--------------------------------------------|
| Angular           | Frontend framework                         |
| Angular Material  | UI component library                       |
| RxJS              | State management and observables           |
| HttpClient        | REST API communication                     |
| Auth Guard        | Route protection for authenticated access  |
| HTTP Interceptor  | Automatically attach JWT to API requests   |
| Google reCAPTCHA  | Bot protection on sensitive forms          |

### 🚀 Backend
| Tool                  | Description                             |
|-----------------------|-----------------------------------------|
| Spring Boot           | Java-based backend framework            |
| Spring Security + JWT | Authentication and Authorization        |
| Spring Data JPA       | ORM for database access                 |
| Hibernate Validator   | Server-side validation framework        |
| Global Exception Handler | Centralized error management         |

### 💾 Database
- **MySQL** – Relational database for persistent data storage

### 🧰 Development Tools
| Tool         | Purpose                           |
|--------------|-----------------------------------|
| Git, GitHub  | Version control & code hosting    |
| Maven        | Backend build and dependency tool |
| npm          | Frontend package management       |
| Swagger      | API documentation (optional)      |
| Postman      | API testing and debugging         |

---

## 📌 Notes

- reCAPTCHA site key should be safely stored in the Angular environment configuration.
- JWT tokens must be stored securely in browser storage and included in the `Authorization` header.
- AuthGuard ensures only authenticated users access protected routes like the dashboard or user list.
- HTTP Interceptor automatically attaches tokens to outgoing HTTP requests, reducing code repetition.

---

_This project is a foundation for building secure, extendable admin systems and can be expanded with multi-role permissions, logging, analytics, or real-time dashboards._

