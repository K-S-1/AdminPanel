package com.admin.panel.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.admin.panel.domain.Admin;
import com.admin.panel.repo.AdminRepo;

@Service
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	AdminRepo authRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Admin user = authRepo.findByUserName(username);
//				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new MyUserDetails(user);
	}

}
