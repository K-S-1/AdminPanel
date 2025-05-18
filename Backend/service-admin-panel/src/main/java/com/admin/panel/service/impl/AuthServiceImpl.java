package com.admin.panel.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.admin.panel.domain.Admin;
import com.admin.panel.exception.InvalidCredentialsException;
import com.admin.panel.proxy.AdminProxy;
import com.admin.panel.proxy.LoginRequest;
import com.admin.panel.proxy.LoginResponse;
import com.admin.panel.proxy.ValidationRequest;
import com.admin.panel.repo.AdminRepo;
import com.admin.panel.service.AuthService;
import com.admin.panel.utils.JwtUtils;
import com.admin.panel.utils.MapperUtils;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	private AuthenticationManager authManeger;

	@Autowired
	private AdminRepo adminRepo;

	@Autowired
	private JwtUtils jwtU;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Override
    public LoginResponse login(LoginRequest loginRequest) {
        String userName = loginRequest.getUserName();
        String password = loginRequest.getPassword();

        if (userName == null || userName.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new InvalidCredentialsException("Username or password must not be empty");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(userName, password);
        Authentication verifiedAuth = authManeger.authenticate(authentication);

        if (verifiedAuth.isAuthenticated()) {
            String token = jwtU.geneateToken(userName);
            return new LoginResponse(token);
        } else {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

	@Override
	public boolean isTokenValidate(ValidationRequest request) {

		try {
			String token = request.getToken();
			if(token!=null && token.startsWith("Bearer ")) {
			token = token.substring(7);
			}
			String path = request.getPath();
			System.out.println(path);

			String userName = jwtU.extractUserName(token);
//			boolean isTokenExpired = jwtU.isTokenExpired(token);
			Admin uName = adminRepo.findByUserName(userName);
			return uName != null && uName.getIsActive();
		} catch (Exception e) {
			return false;
		}

	}

	public void updateResetPasswordToken(String token, String email) {
		Admin admin = adminRepo.findByUserName(email);
//				.orElseThrow(() -> new RuntimeException("Email not found"));
		System.out.println("Email not found");
		if (admin != null) {
			admin.setResetPasswordToken(token);
			adminRepo.save(admin);
		}
	}

	public AdminProxy getByResetPasswordToken(String token) {
		Admin passwordToken = adminRepo.findByResetPasswordToken(token);
		return MapperUtils.convertValue(passwordToken, AdminProxy.class);
	}

	@Override
	public void updatePassword(AdminProxy adminProxy, String newPassword) {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String encodedPassword = passwordEncoder.encode(newPassword);

		Admin convertValue = MapperUtils.convertValue(adminProxy, Admin.class);

		convertValue.setPassword(bCryptPasswordEncoder.encode(encodedPassword));

		convertValue.setResetPasswordToken(null);
		adminRepo.save(convertValue);
	}

}
