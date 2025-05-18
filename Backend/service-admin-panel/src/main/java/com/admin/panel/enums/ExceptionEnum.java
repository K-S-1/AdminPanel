package com.admin.panel.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public enum ExceptionEnum {
	NULLABLE_VALUE("6050", "The value can't be null"),
	NO_SUCH_OBJECT_DATA("8012", "There is no such object found"),
	ALL_EMPTY("6060", "The list is empty"),
	   INVALID_CREDENTIALS("AUTH_001", "Invalid username or password"),
	    ADMIN_NOT_FOUND("ADMIN_001", "Admin not found with given username"),
	    INTERNAL_SERVER_ERROR("GEN_001", "Something went wrong. Please try again later.");


	private final String errCode;
	private final String errMessage;
}
