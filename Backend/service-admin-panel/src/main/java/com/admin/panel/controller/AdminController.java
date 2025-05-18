package com.admin.panel.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.admin.panel.proxy.AdminProfileUpdateRequest;
import com.admin.panel.proxy.AdminProxy;
import com.admin.panel.service.AdminService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/adminPanel")
public class AdminController {
	@Autowired
	private AdminService adminService;

	@GetMapping("/getAllUsers")
	public ResponseEntity<Map<String, Object>> getAllContact(@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "10") Integer size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "ASC") String direction) {

		return adminService.getUsers(page, size, sortBy, direction);
	}

//	@GetMapping("/getAllUsers")
//	public ResponseEntity<Map<String, Object>> getAllContact(@RequestParam(defaultValue = "0") Integer page,
//			@RequestParam(defaultValue = "10") Integer size, @RequestParam(defaultValue = "id") String sortBy,
//			@RequestParam(defaultValue = "ASC") String direction,    @RequestParam(required = false) String search
//) {
//
//		return adminService.getUsers(page, size, sortBy, direction,search);
//	}

	@GetMapping("/getLoggedInAdmin/{token}")
	public ResponseEntity<AdminProxy> getLoggedInAdmin(@PathVariable String token) {
		return new ResponseEntity<AdminProxy>(adminService.getUserBytoken(token), HttpStatus.OK);
	}

	@PostMapping("/addAdmin")
	public ResponseEntity<AdminProxy> addAdmin(@RequestBody AdminProxy adminProxy) {
		return new ResponseEntity<>(adminService.addUser(adminProxy), HttpStatus.CREATED);
	}

	@PostMapping("/addBulkUser/{total}")
	public ResponseEntity<String> addBulkUser(@PathVariable() Integer total) {
		return new ResponseEntity<>(adminService.saveBulkUsers(total), HttpStatus.CREATED);
	}

	@DeleteMapping("/deleteUser/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable() Long id) {
		return new ResponseEntity<String>(adminService.deleteUserById(id), HttpStatus.OK);
	}

	@PutMapping("/updateUser/{id}")
	public ResponseEntity<AdminProxy> updateContact(@RequestBody AdminProxy adminProxy, @PathVariable() Long id) {
		return new ResponseEntity<AdminProxy>(adminService.updateUserById(adminProxy, id), HttpStatus.OK);
	}

//	@PutMapping("/updateAdminProfile")
//	public ResponseEntity<String> updateAdminProfile(@RequestParam() String name, @RequestParam() String dob,
//			@RequestParam() String gender, @RequestParam() String address, @RequestParam() String contactNumber,
//			@RequestParam(required = false) Integer pinCode, @RequestParam() String userName,
//			@RequestParam(required = false) MultipartFile profileImage) {
//
//		return new ResponseEntity<>(adminService.updateNewAdminProfile(name, dob, gender, address, contactNumber,
//				pinCode, userName, profileImage), HttpStatus.ACCEPTED);
//	}

	@PutMapping("/updateAdminDetails")
	public ResponseEntity<Map<String, String>> updateAdminDetails(@RequestBody AdminProfileUpdateRequest request) {
	    String message = adminService.updateAdminDetailsOnly(
	        request.getName(), request.getDob(), request.getGender(),
	        request.getAddress(), request.getContactNumber(),
	        request.getPinCode(), request.getUserName()
	    );
	    Map<String, String> response = new HashMap<>();
	    response.put("message", message);
	    return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
	}

	@PutMapping("/updateAdminImage")
	public ResponseEntity<Map<String, String>> updateAdminImage(
	        @RequestPart("userName") String userName,
	        @RequestPart("profileImage") MultipartFile profileImage) {

	    String message = adminService.updateProfileImageOnly(userName, profileImage);
	    Map<String, String> response = new HashMap<>();
	    response.put("message", message);
	    return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
	}

//	@PutMapping("/updateProfile")
//    public ResponseEntity<String> updateAdminProfile(@RequestPart("admin") AdminDto adminDto) {
//        try {
//            adminService.updateAdminDetails(adminDto);
//            return ResponseEntity.ok("Admin details updated successfully");
//        } catch (ResourceNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating admin details");
//        }
//    }
//
//    @PutMapping("/updateImage/{adminId}")
//    public ResponseEntity<String> updateAdminImage(@PathVariable Long adminId,
//                                                   @RequestPart("image") MultipartFile image) {
//        try {
//            adminService.updateAdminImage(adminId, image);
//            return ResponseEntity.ok("Admin image updated successfully");
//        } catch (ResourceNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating image");
//        }
//    }

}
