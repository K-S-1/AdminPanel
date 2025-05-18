package com.admin.panel.proxy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
	@NotBlank(message = "Token cannot be blank")
	private String token;

	@NotBlank(message = "New password cannot be blank")
	@Size(min = 8, message = "Password must be at least 8 characters long")
	private String newPassword;
}
