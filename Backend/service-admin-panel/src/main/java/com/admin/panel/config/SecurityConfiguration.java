package com.admin.panel.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.admin.panel.service.impl.MyUserDetailsService;
import com.admin.panel.utils.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Autowired
	private MyUserDetailsService myUserDetailsService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(c -> c.disable());
		http.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.PUT, "/adminPanel/updateAdminImage").authenticated()
				.requestMatchers("/auth/register", "/auth/login", "/auth/forgotPassword", "/auth/resetPassword/**",
						"/adminPanel/addBulkUser/**", "/adminPanel/addAdmin","/adminPanel/updateAdminProfile")
				
				.permitAll().requestMatchers("/actuator/**").permitAll().anyRequest().authenticated());

//		http.httpBasic(Customizer.withDefaults());
		http.addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

		http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		return http.build();
	}

	@Bean
	public JwtFilter jwtFilter() {
		return new JwtFilter();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public UserDetailsService userDetailsService() {
//		UserDetails userDetails = User.builder().username("krishna@gmail.com").password(bCryptPasswordEncoder().encode("krishna1234")).roles("ADMIN")
//				.build();
//		return new InMemoryUserDetailsManager(userDetails);
		return myUserDetailsService;
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider daoAuth = new DaoAuthenticationProvider();
		daoAuth.setPasswordEncoder(bCryptPasswordEncoder());
		daoAuth.setUserDetailsService(userDetailsService());
		return daoAuth;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
