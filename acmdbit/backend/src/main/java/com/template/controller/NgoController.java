
package com.template.controller;

import com.template.model.Ngo;
import com.template.repository.NgoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NgoController {

    @Autowired
    private NgoRepository ngoRepository;

    // GET all active NGOs (public feed)
    @GetMapping("/ngos")
    public List<Ngo> getAllNgos() {
        return ngoRepository.findByStatus("ACTIVE");
    }

    // GET single NGO by id
    @GetMapping("/ngos/{id}")
    public Map<String, Object> getNgoById(@PathVariable Long id) {
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        Map<String, Object> response = new HashMap<>();
        if (ngoOpt.isEmpty()) {
            response.put("error", "NGO not found");
            return response;
        }
        response.put("ngo", ngoOpt.get());
        return response;
    }

    // GET pending NGOs (admin only)
    @GetMapping("/ngos/pending")
    public List<Ngo> getPendingNgos() {
        return ngoRepository.findByStatus("PENDING");
    }

    // POST register new NGO (public)
    @PostMapping("/ngos/register")
    public Map<String, Object> registerNgo(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Ngo ngo = new Ngo();
            ngo.setEmail((String) body.get("email"));
            ngo.setPasswordHash((String) body.get("password"));
            ngo.setName((String) body.get("name"));
            ngo.setDescription((String) body.get("description"));
            ngo.setLogoEmoji((String) body.getOrDefault("logo_emoji", "❤️"));
            ngo.setCategory((String) body.getOrDefault("category", "General"));
            ngo.setLocation((String) body.get("location"));
            ngo.setFoundedYear(body.get("founded_year") != null 
                ? Integer.valueOf(body.get("founded_year").toString()) : null);
            ngo.setDarpanId((String) body.get("darpan_id"));
            ngo.setTrustScore(0);
            ngo.setStatus("PENDING");
            ngo.setHeroImageUrl((String) body.get("hero_image_url"));
            ngo.setWebsiteUrl((String) body.get("website_url"));
            ngo.setYoutubeUrl((String) body.get("youtube_url"));
            ngo.setInstagramUrl((String) body.get("instagram_url"));
            ngo.setDonationUrl((String) body.get("donation_url"));
            ngo.setGoogleFormUrl((String) body.get("google_form_url"));
            ngo.setTeamMembers(body.get("team_members") != null 
                ? body.get("team_members").toString() : "[]");
            ngo.setFundsBreakdown("{}");
            ngo.setIsActive(true);
            ngo.setCreatedAt(LocalDateTime.now());
            ngo.setUpdatedAt(LocalDateTime.now());

            ngoRepository.save(ngo);

            response.put("success", true);
            response.put("message", "Application received. Approval in 24 hours.");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return response;
        }
    }

    // POST admin adds NGO directly (skips pending)
    @PostMapping("/ngos")
    public Ngo addNgo(@RequestBody Map<String, Object> body) {
        Ngo ngo = new Ngo();
        ngo.setEmail((String) body.get("email"));
        ngo.setPasswordHash((String) body.getOrDefault("password", "pass123"));
        ngo.setName((String) body.get("name"));
        ngo.setDescription((String) body.get("description"));
        ngo.setLogoEmoji((String) body.getOrDefault("logo_emoji", "❤️"));
        ngo.setCategory((String) body.getOrDefault("category", "General"));
        ngo.setLocation((String) body.get("location"));
        ngo.setFoundedYear(body.get("founded_year") != null 
            ? Integer.valueOf(body.get("founded_year").toString()) : null);
        ngo.setDarpanId((String) body.get("darpan_id"));
        ngo.setTrustScore(body.get("trust_score") != null 
            ? Integer.valueOf(body.get("trust_score").toString()) : 0);
        ngo.setStatus("ACTIVE");
        ngo.setApprovedBy(1L);
        ngo.setApprovedAt(LocalDateTime.now());
        ngo.setHeroImageUrl((String) body.get("hero_image_url"));
        ngo.setWebsiteUrl((String) body.get("website_url"));
        ngo.setYoutubeUrl((String) body.get("youtube_url"));
        ngo.setInstagramUrl((String) body.get("instagram_url"));
        ngo.setDonationUrl((String) body.get("donation_url"));
        ngo.setGoogleFormUrl((String) body.get("google_form_url"));
        ngo.setTeamMembers(body.get("team_members") != null 
            ? body.get("team_members").toString() : "[]");
        ngo.setFundsBreakdown("{}");
        ngo.setIsActive(true);
        ngo.setCreatedAt(LocalDateTime.now());
        ngo.setUpdatedAt(LocalDateTime.now());

        return ngoRepository.save(ngo);
    }

    // POST approve NGO
    @PostMapping("/ngos/{id}/approve")
    public Map<String, Object> approveNgo(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "NGO not found");
            return response;
        }
        Ngo ngo = ngoOpt.get();
        ngo.setStatus("ACTIVE");
        ngo.setApprovedBy(1L);
        ngo.setApprovedAt(LocalDateTime.now());
        ngo.setUpdatedAt(LocalDateTime.now());
        ngoRepository.save(ngo);

        response.put("success", true);
        response.put("status", "ACTIVE");
        return response;
    }

    // POST reject NGO
    @PostMapping("/ngos/{id}/reject")
    public Map<String, Object> rejectNgo(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        Optional<Ngo> ngoOpt = ngoRepository.findById(id);
        if (ngoOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "NGO not found");
            return response;
        }
        Ngo ngo = ngoOpt.get();
        ngo.setStatus("REJECTED");
        if (body != null && body.get("reason") != null) {
            ngo.setRejectionReason(body.get("reason"));
        }
        ngo.setUpdatedAt(LocalDateTime.now());
        ngoRepository.save(ngo);

        response.put("success", true);
        response.put("status", "REJECTED");
        return response;
    }
}