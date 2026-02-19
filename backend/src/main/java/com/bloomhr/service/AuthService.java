package com.bloomhr.service;

import com.bloomhr.dto.Dto;
import com.bloomhr.model.User;
import com.bloomhr.repository.UserRepository;
import com.bloomhr.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder  = encoder;
        this.jwtUtil  = jwtUtil;
    }

    public Dto.AuthResponse login(Dto.LoginRequest req) {
        User user = userRepo.findByEmail(req.email())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled. Contact HR.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new Dto.AuthResponse(token, Dto.UserDto.from(user));
    }

    public Dto.AuthResponse register(Dto.RegisterRequest req) {
        if (userRepo.existsByEmail(req.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email().toLowerCase().trim());
        user.setPassword(encoder.encode(req.password()));

        try {
            user.setRole(User.Role.valueOf(req.role() != null ? req.role().toUpperCase() : "EMPLOYEE"));
        } catch (IllegalArgumentException e) {
            user.setRole(User.Role.EMPLOYEE);
        }

        userRepo.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new Dto.AuthResponse(token, Dto.UserDto.from(user));
    }
}
