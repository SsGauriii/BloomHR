package com.bloomhr.service;

import com.bloomhr.dto.Dto;
import com.bloomhr.model.User;
import com.bloomhr.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final UserRepository userRepo;

    public EmployeeService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // Get all active employees
    public List<Dto.UserDto> getAllEmployees() {
        return userRepo.findByActiveTrue()
                .stream()
                .map(Dto.UserDto::from)
                .toList();
    }

    // Get single employee by ID
    public Dto.UserDto getById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return Dto.UserDto.from(user);
    }

    // Get my own profile
    public Dto.UserDto getMyProfile(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return Dto.UserDto.from(user);
    }

    // Update my own profile (employee self-service)
    public Dto.UserDto updateMyProfile(String email, Dto.ProfileUpdateRequest req) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.name() != null && !req.name().isBlank())
            user.setName(req.name().trim());
        if (req.department() != null)
            user.setDepartment(req.department().trim());
        if (req.jobTitle() != null)
            user.setJobTitle(req.jobTitle().trim());
        if (req.experienceYears() != null)
            user.setExperienceYears(req.experienceYears());
        if (req.bio() != null)
            user.setBio(req.bio().trim());
        if (req.skills() != null)
            user.setSkills(String.join(",", req.skills()));

        return Dto.UserDto.from(userRepo.save(user));
    }

    // HR: Update any employee
    public Dto.UserDto updateEmployee(Long id, Dto.ProfileUpdateRequest req) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (req.name() != null && !req.name().isBlank())
            user.setName(req.name().trim());
        if (req.department() != null)
            user.setDepartment(req.department().trim());
        if (req.jobTitle() != null)
            user.setJobTitle(req.jobTitle().trim());
        if (req.experienceYears() != null)
            user.setExperienceYears(req.experienceYears());
        if (req.bio() != null)
            user.setBio(req.bio().trim());
        if (req.skills() != null)
            user.setSkills(String.join(",", req.skills()));

        return Dto.UserDto.from(userRepo.save(user));
    }

    // HR: Soft-delete (deactivate) an employee
    public void deactivateEmployee(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        user.setActive(false);
        userRepo.save(user);
    }
}
