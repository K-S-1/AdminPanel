package com.admin.panel.exception;

import com.admin.panel.enums.ExceptionEnum;

import lombok.Getter;

@Getter

public class CustomAppException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    private final ExceptionEnum exceptionEnum;

	public CustomAppException(ExceptionEnum exceptionEnum) {
		super(exceptionEnum.getErrMessage()); // passes message to parent (RuntimeException)
		this.exceptionEnum = exceptionEnum;

	}

}
