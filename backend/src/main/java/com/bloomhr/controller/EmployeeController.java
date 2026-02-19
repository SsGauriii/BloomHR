package com.bloomhr.controller;

import com.bloomhr.dto.Dto;
import com.bloomhr.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // GET /api/employees — everyone can see directory
    @GetMapping
    public ResponseEntity<List<Dto.UserDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    // GET /api/employees/me — employee's own profile
    @GetMapping("/me")
    public ResponseEntity<Dto.UserDto> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(employeeService.getMyProfile(auth.getName()));
    }

    // PUT /api/employees/me — employee updates own profile
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(Authentication auth,
                                              @RequestBody Dto.ProfileUpdateRequest req) {
        try {
            return ResponseEntity.ok(employeeService.updateMyProfile(auth.getName(), req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/employees/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(employeeService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/employees/{id} — HR only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id,
                                             @RequestBody Dto.ProfileUpdateRequest req) {
        try {
            return ResponseEntity.ok(employeeService.updateEmployee(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/employees/{id} — HR only (soft delete)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> deactivateEmployee(@PathVariable Long id) {
        try {
            employeeService.deactivateEmployee(id);
            return ResponseEntity.ok(Map.of("message", "Employee deactivated"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
