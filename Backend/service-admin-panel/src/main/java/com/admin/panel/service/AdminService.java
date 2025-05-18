package com.admin.panel.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.admin.panel.proxy.AdminProxy;

public interface AdminService {
	public List<AdminProxy> getAllUsers();

	public AdminProxy addUser(AdminProxy adminProxy);

	public String deleteUserById(Long id);

	public AdminProxy updateUserById(AdminProxy adminProxy, Long id);

	public ResponseEntity<Map<String, Object>> getUsers(Integer page, Integer size, String sortBy, String direction);

	public String saveBulkUsers(Integer noOfUsers);

	AdminProxy getUserBytoken(String token);

//	public String updateNewAdminProfile(String name, String dob, String gender, String address, String contactNumber,
//			Integer pinCode,String userName, MultipartFile profileImage);

	String updateAdminDetailsOnly(String name, String dob, String gender, String address, String contactNumber,
			Integer pinCode, String userName);

	String updateProfileImageOnly(String userName, MultipartFile profileImage);

}
