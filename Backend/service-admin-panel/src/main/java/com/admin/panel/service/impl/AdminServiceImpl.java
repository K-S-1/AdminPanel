package com.admin.panel.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.admin.panel.domain.Admin;
import com.admin.panel.enums.AccessRole;
import com.admin.panel.enums.ExceptionEnum;
import com.admin.panel.enums.Gender;
import com.admin.panel.exception.CustomAppException;
import com.admin.panel.exception.ResourceNotFoundException;
import com.admin.panel.proxy.AdminProxy;
import com.admin.panel.repo.AdminRepo;
import com.admin.panel.service.AdminService;
import com.admin.panel.utils.JwtUtils;
import com.admin.panel.utils.MapperUtils;
import com.github.javafaker.Faker;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminRepo adminRepo;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private JwtUtils jwtU;

	@Override
	public List<AdminProxy> getAllUsers() {
		List<Admin> all = adminRepo.findAll();
		return MapperUtils.convertListOfValue(all, AdminProxy.class);
	}

	@Override
	public AdminProxy getUserBytoken(String token) {
		String userName = jwtU.extractUserName(token);
		Admin uName = adminRepo.findByUserName(userName);
		return MapperUtils.convertValue(uName, AdminProxy.class);
	}

	@Override
	public AdminProxy addUser(AdminProxy adminProxy) {
		if (adminProxy == null) {
			throw new CustomAppException(ExceptionEnum.NULLABLE_VALUE);
		} else {
			Admin convertValue = MapperUtils.convertValue(adminProxy, Admin.class);
			convertValue.setPassword(bCryptPasswordEncoder.encode(convertValue.getPassword()));
			Admin save = adminRepo.save(convertValue);
			return MapperUtils.convertValue(save, AdminProxy.class);
		}
	}

	@Override
	public ResponseEntity<Map<String, Object>> getUsers(Integer page, Integer size, String sortBy, String direction) {

		// Validate input
		if (page == null || page < 0)
			page = 0;
		if (size == null || size <= 0)
			size = 10;
		if (size > 100)
			size = 100;

		Sort.Direction sortDirection = direction != null && direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC
				: Sort.Direction.ASC;

		Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy != null ? sortBy : "id"));

		Page<Admin> pageResult = adminRepo.findAll(pageable);

		Map<String, Object> response = new HashMap<>();
		response.put("content", pageResult.getContent());
		response.put("totalElements", pageResult.getTotalElements());
		response.put("totalPages", pageResult.getTotalPages());
		response.put("currentPage", pageResult.getNumber());
		response.put("size", pageResult.getSize());
		response.put("first", pageResult.isFirst());
		response.put("last", pageResult.isLast());
		response.put("empty", pageResult.isEmpty());

		return ResponseEntity.ok(response);
	}

	@Override
	public String deleteUserById(Long id) {
		if (adminRepo.existsById(id)) {
			adminRepo.deleteById(id);
			return "Deleted Successfully";
		} else {
			throw new CustomAppException(ExceptionEnum.NO_SUCH_OBJECT_DATA);

		}
	}

	@Override
	public AdminProxy updateUserById(AdminProxy adminProxy, Long id) {
		if (adminProxy == null) {
			throw new CustomAppException(ExceptionEnum.NULLABLE_VALUE);
		}
		if (!adminRepo.existsById(id)) {
			throw new CustomAppException(ExceptionEnum.NO_SUCH_OBJECT_DATA);
		} else {
			Admin byId = adminRepo.findById(id).get();
			Admin convertValue = MapperUtils.convertValue(adminProxy, Admin.class);
			byId.setName(convertValue.getName());
//		byId.setAccessRole(convertValue.getAccessRole());
			byId.setAddress(convertValue.getAddress());
			byId.setContactNumber(convertValue.getContactNumber());
			byId.setDob(convertValue.getDob());
			byId.setGender(convertValue.getGender());
			byId.setPinCode(convertValue.getPinCode());
			byId.setProfileImage(convertValue.getProfileImage());
			adminRepo.save(byId);
			return MapperUtils.convertValue(byId, AdminProxy.class);
		}
	}

	public Admin generateUsers() {
		Faker f = new Faker();
		Admin admin = new Admin();
		String firstName = f.name().firstName();
		String lastName = f.name().lastName();
		admin.setName(firstName.toString() + " " + lastName.toString());
		String temp = firstName.toString() + lastName.toString() + "@gmail.com";
		admin.setUserName(temp);
		String dob = f.date().birthday(20, 90).toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate()
				.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yy"));
		admin.setDob(dob);
		String plainPassword = firstName + f.random().nextInt(3) + lastName + f.random().nextInt(3);
		admin.setPassword(bCryptPasswordEncoder.encode(plainPassword));
		System.out.println("Plain Password: " + plainPassword); // 👈 Print it here
		boolean randomGender = new Random().nextBoolean();
		admin.setGender(randomGender ? Gender.MALE : Gender.FEMALE);
		admin.setAddress(f.address().fullAddress());
//		admin.setProfileImage(temp);
		admin.setContactNumber(f.phoneNumber().phoneNumber());
		admin.setPinCode(new Random().nextInt(900000) + 100000);
		admin.setAccessRole(AccessRole.USER);
		admin.isActive = true;
		return admin;
	}

	@Override
	public String saveBulkUsers(Integer noOfUsers) {
		for (int i = 1; i <= noOfUsers; i++) {
			adminRepo.save(generateUsers());
		}
		return noOfUsers + " Users Saved Successfully";
	}

	@Override
	public String updateAdminDetailsOnly(String name, String dob, String gender, String address, String contactNumber,
			Integer pinCode, String userName) {
//		if (userName == null || userName.trim().isEmpty()) {
//		    throw new ResourceNotFoundException("Admin username must not be null or empty");
//		}
//
//		Admin admin = adminRepo.findByUserName(userName);
//
//		if (admin == null) {
//		    throw new ResourceNotFoundException("Admin not found with userName: " + userName);
//		}
		Admin admin = adminRepo.findByUserName(userName);

		admin.setName(name);
		admin.setDob(dob);
		admin.setGender(MapperUtils.convertValue(gender, Gender.class));
		admin.setAddress(address);
		admin.setContactNumber(contactNumber);
		admin.setPinCode(pinCode);
		adminRepo.save(admin);

		return "Admin details updated successfully.";
	}

	@Override
	public String updateProfileImageOnly(String userName, MultipartFile profileImage) {
		Admin admin = adminRepo.findByUserName(userName);
		if (admin == null) {
			return "Admin not found for the given token.";
		}

		if (profileImage != null && !profileImage.isEmpty()) {
			try {
				admin.setProfileImage(profileImage.getBytes());
				admin.setProfileContentType(profileImage.getContentType());
			} catch (IOException e) {
				e.printStackTrace();
				throw new RuntimeException("Failed to read image file", e);
			}
			adminRepo.save(admin);
			return "Profile image updated successfully.";
		}
		return "No image provided.";
	}

}
