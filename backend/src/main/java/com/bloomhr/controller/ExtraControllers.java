package com.bloomhr.controller;

import com.bloomhr.dto.Dto;
import com.bloomhr.service.DashboardService;
import com.bloomhr.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ExtraControllers {

    private final DashboardService dashboardService;
    private final EmailService emailService;

    public ExtraControllers(DashboardService dashboardService, EmailService emailService) {
        this.dashboardService = dashboardService;
        this.emailService = emailService;
    }

    // ── DASHBOARD ──
    @GetMapping("/api/dashboard/stats")
    public ResponseEntity<Dto.DashboardStats> stats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // ── CONTACT ──
    @PostMapping("/api/contact/send")
    public ResponseEntity<?> sendContact(@RequestBody Dto.ContactRequest req) {
        try {
            emailService.sendContactEmail(req);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send email. Please try again."));
        }
    }
}
