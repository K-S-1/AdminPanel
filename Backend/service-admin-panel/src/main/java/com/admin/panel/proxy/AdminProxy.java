package com.admin.panel.proxy;

import com.admin.panel.enums.AccessRole;
import com.admin.panel.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProxy {
	private Long id;

	private String name;

	private String dob;

	private String userName;

	private String password;

	private Gender gender;

	private String address;

	private byte[] profileImage;

	private String profileContentType;

	private String contactNumber;

	private Integer pinCode;

	private AccessRole accessRole;

	private String resetPasswordToken;
	
	public Boolean isActive = true;

}
