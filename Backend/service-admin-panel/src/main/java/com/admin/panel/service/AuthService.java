package com.admin.panel.service;

import com.admin.panel.proxy.AdminProxy;
import com.admin.panel.proxy.LoginRequest;
import com.admin.panel.proxy.LoginResponse;
import com.admin.panel.proxy.ValidationRequest;

public interface AuthService {
	public LoginResponse login(LoginRequest loginRequest);

	public boolean isTokenValidate(ValidationRequest request);

	public void updateResetPasswordToken(String token, String email);

	public AdminProxy getByResetPasswordToken(String token);

	public void updatePassword(AdminProxy adminProxy, String newPassword);

}
