package com.admin.panel.domain;

import com.admin.panel.enums.AccessRole;
import com.admin.panel.enums.Gender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "admin_users")
//@JsonInclude(Include.NON_NULL)
public class Admin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Name is required")
	private String name;

	@NotNull(message = "Date of Birth is required")
	private String dob;

	@NotBlank(message = "Username is required")
	@Column(unique = true)
	private String userName;

	@NotBlank(message = "Password is required")
	private String password;

	@Enumerated(EnumType.STRING)
	@NotNull(message = "Gender is required")
	private Gender gender;

	@NotBlank(message = "Address is required")
	private String address;

	@Lob
	private byte[] profileImage;

	private String profileContentType;

	@NotBlank(message = "Contact number is required")
	private String contactNumber;

	private Integer pinCode;

	private AccessRole accessRole;

	private String resetPasswordToken;
	public Boolean isActive = true;

}
