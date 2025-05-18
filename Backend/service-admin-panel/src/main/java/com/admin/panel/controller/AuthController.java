package com.admin.panel.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.admin.panel.proxy.AdminProxy;
import com.admin.panel.proxy.ForgotPasswordRequest;
import com.admin.panel.proxy.LoginRequest;
import com.admin.panel.proxy.LoginResponse;
import com.admin.panel.proxy.ResetPasswordRequest;
import com.admin.panel.proxy.ValidationRequest;
import com.admin.panel.service.AuthService;

import jakarta.validation.Valid;
import net.bytebuddy.utility.RandomString;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	AuthService authService;

	public AuthController() {
		System.out.println("AuthController initialized!");
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

	@PostMapping("/isTokenValidate")
	public boolean isTokenValidate(@RequestBody ValidationRequest request) {
		return authService.isTokenValidate(request);
	}

	@PostMapping("/forgotPassword")
	public ResponseEntity<String> processForgotPassword(@RequestBody ForgotPasswordRequest request) {
		String email = request.getUserName();
		if (email == null || email.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("userName field is required in the request body.");
		}
		String token = RandomString.make(30);
		try {
			authService.updateResetPasswordToken(token, email);
			String resetPasswordLink = "http://localhost:4200/reset-password?token=" + token;
			System.out.println("Reset link generated (would be sent via email): " + resetPasswordLink);
			return ResponseEntity.ok().body("{\"resetLink\": \"" + resetPasswordLink + "\"}");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected internal error occurred.");
		}
	}

	@PostMapping("/resetPassword")
	public ResponseEntity<?> processResetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		String token = request.getToken();
		String password = request.getNewPassword();
		try {
			AdminProxy adminProxy = authService.getByResetPasswordToken(token);
			if (adminProxy == null) {
				return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token.")); // Using Map.of
																										// for simple
																										// json
			} else {
				authService.updatePassword(adminProxy, password);
				return ResponseEntity.ok().body(Map.of("message", "Password has been successfully reset."));
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError()
					.body(Map.of("error", "An unexpected error occurred while resetting the password."));
		}
	}

}
