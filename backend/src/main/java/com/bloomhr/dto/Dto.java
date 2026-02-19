package com.bloomhr.dto;

import com.bloomhr.model.User;
import java.util.List;

// ── Auth DTOs ──
public class Dto {

    public record LoginRequest(String email, String password) {}

    public record RegisterRequest(String name, String email, String password, String role) {}

    public record AuthResponse(String token, UserDto user) {}

    // ── User DTO (safe — no password) ──
    public record UserDto(
        Long id,
        String name,
        String email,
        String role,
        String department,
        String jobTitle,
        Integer experienceYears,
        String bio,
        List<String> skills
    ) {
        public static UserDto from(User u) {
            List<String> skillList = (u.getSkills() != null && !u.getSkills().isBlank())
                ? List.of(u.getSkills().split(",")).stream()
                      .map(String::trim).filter(s -> !s.isEmpty()).toList()
                : List.of();
            return new UserDto(
                u.getId(), u.getName(), u.getEmail(),
                u.getRole().name(), u.getDepartment(),
                u.getJobTitle(), u.getExperienceYears(),
                u.getBio(), skillList
            );
        }
    }

    // ── Profile Update ──
    public record ProfileUpdateRequest(
        String name,
        String department,
        String jobTitle,
        Integer experienceYears,
        String bio,
        List<String> skills
    ) {}

    // ── Dashboard Stats ──
    public record DashboardStats(
        long totalEmployees,
        long totalDepartments,
        long totalSkills,
        double avgExperience,
        List<DeptStat> departmentStats
    ) {}

    public record DeptStat(String department, long count) {}

    // ── Contact ──
    public record ContactRequest(
        String senderName,
        String senderEmail,
        String subject,
        String message,
        String category
    ) {}
}
