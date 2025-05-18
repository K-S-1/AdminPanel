package com.admin.panel.proxy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileUpdateRequest {
	private String name;
	private String dob;
	private String gender;
	private String address;
	private String contactNumber;
	private Integer pinCode;
	private String userName;
}
