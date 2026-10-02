package com.template.controller;

import com.template.model.Admin;
import com.template.model.Ngo;
import com.template.repository.NgoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private NgoRepository ngoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Map<String, Object> response = new HashMap<>();

        // Check admin first
        try {
            Admin admin = entityManager
                .createQuery("SELECT a FROM Admin a WHERE a.email = :email AND a.passwordHash = :pass", Admin.class)
                .setParameter("email", email)
                .setParameter("pass", password)
                .getSingleResult();
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("name", admin.getFullName());
            return response;
        } catch (Exception ignored) {}

        // Check NGO
        Optional<Ngo> ngoOpt = ngoRepository.findByEmail(email);
        if (ngoOpt.isPresent() && ngoOpt.get().getPasswordHash().equals(password)) {
            Ngo ngo = ngoOpt.get();
            response.put("success", true);
            response.put("role", "NGO");
            response.put("name", ngo.getName());
            response.put("status", ngo.getStatus());
            response.put("ngoId", ngo.getId());
            return response;
        }

        response.put("success", false);
        response.put("error", "Invalid credentials");
        return response;
    }
}
