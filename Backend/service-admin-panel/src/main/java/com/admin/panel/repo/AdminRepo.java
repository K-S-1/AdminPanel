package com.admin.panel.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.admin.panel.domain.Admin;

public interface AdminRepo extends JpaRepository<Admin, Long> {
	@Query("SELECT r FROM Admin r WHERE r.userName = ?1")
	Admin findByUserName(String username);

	public Admin findByResetPasswordToken(String token);

}
