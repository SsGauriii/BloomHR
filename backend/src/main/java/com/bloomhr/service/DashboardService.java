package com.bloomhr.service;

import com.bloomhr.dto.Dto;
import com.bloomhr.model.User;
import com.bloomhr.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepo;

    public DashboardService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public Dto.DashboardStats getStats() {
        List<User> active = userRepo.findByActiveTrue();

        long total = active.size();

        // Unique departments
        Set<String> depts = active.stream()
                .map(User::getDepartment)
                .filter(d -> d != null && !d.isBlank())
                .collect(Collectors.toSet());

        // Unique skills
        Set<String> allSkills = active.stream()
                .filter(u -> u.getSkills() != null && !u.getSkills().isBlank())
                .flatMap(u -> Arrays.stream(u.getSkills().split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        // Average experience
        double avgExp = active.stream()
                .filter(u -> u.getExperienceYears() != null)
                .mapToInt(User::getExperienceYears)
                .average()
                .orElse(0.0);

        // Department distribution
        Map<String, Long> deptMap = active.stream()
                .filter(u -> u.getDepartment() != null && !u.getDepartment().isBlank())
                .collect(Collectors.groupingBy(User::getDepartment, Collectors.counting()));

        List<Dto.DeptStat> deptStats = deptMap.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> new Dto.DeptStat(e.getKey(), e.getValue()))
                .toList();

        return new Dto.DashboardStats(total, depts.size(), allSkills.size(),
                Math.round(avgExp * 10.0) / 10.0, deptStats);
    }
}
