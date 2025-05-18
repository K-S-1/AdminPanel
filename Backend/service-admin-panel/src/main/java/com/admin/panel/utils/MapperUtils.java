package com.admin.panel.utils;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

public class MapperUtils {
	public static <T> T convertValue(Object fromValue, Class<T> toValueType) {
		ObjectMapper map = new ObjectMapper();
		return map.convertValue(fromValue, toValueType);
	}

	public static <T> List<T> convertListOfValue(List<?> fromValue, Class<T> toValueType) {
		List<T> list = new ArrayList<>();
		for (Object o : fromValue) {
			ObjectMapper map = new ObjectMapper();
			T convertValue = map.convertValue(o, toValueType);
			list.add(convertValue);
		}
		return list;
	}

}
