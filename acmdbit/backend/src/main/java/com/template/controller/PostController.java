package com.template.controller;

import com.template.model.Ngo;
import com.template.model.Post;
import com.template.repository.NgoRepository;
import com.template.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NgoRepository ngoRepository;

    // GET all posts with NGO embedded (home feed)
    @GetMapping("/posts")
    public List<Map<String, Object>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String top_needed) {

        List<Post> posts;

        if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategoryOrderByIsTopNeededDescEventDateAsc(category);
        } else if (status != null && !status.isEmpty()) {
            posts = postRepository.findByStatusOrderByEventDateAsc(status);
        } else if (top_needed != null && top_needed.equals("1")) {
            posts = postRepository.findByIsTopNeededTrueOrderByEventDateAsc();
        } else {
            posts = postRepository.findAllByOrderByIsTopNeededDescEventDateAsc();
        }

        return buildPostList(posts);
    }

    // GET single post with NGO embedded
    @GetMapping("/posts/{id}")
    public Map<String, Object> getPostById(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        Map<String, Object> response = new HashMap<>();
        if (postOpt.isEmpty()) {
            response.put("error", "Post not found");
            return response;
        }
        Post post = postOpt.get();
        response.put("post", post);
        ngoRepository.findById(post.getNgoId()).ifPresent(ngo -> response.put("ngo", ngo));
        return response;
    }

    // POST create new post
    @PostMapping("/posts")
    public Map<String, Object> createPost(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Post post = new Post();
            post.setNgoId(Long.valueOf(body.get("ngo_id").toString()));
            post.setPostedBy((String) body.getOrDefault("posted_by", "ADMIN"));
            post.setTitle((String) body.get("title"));
            post.setSummary((String) body.get("summary"));
            post.setRawInput((String) body.get("raw_input"));
            post.setCategory((String) body.getOrDefault("category", "General"));
            post.setImpactCount(body.get("impact_count") != null 
                ? Integer.valueOf(body.get("impact_count").toString()) : 0);
            post.setFundsGoal(body.get("funds_goal") != null 
                ? new BigDecimal(body.get("funds_goal").toString()) : BigDecimal.ZERO);
            post.setFundsRaised(body.get("funds_raised") != null 
                ? new BigDecimal(body.get("funds_raised").toString()) : BigDecimal.ZERO);
            post.setVolunteersNeeded(body.get("volunteers_needed") != null 
                ? Integer.valueOf(body.get("volunteers_needed").toString()) : 0);
            post.setMediaUrls(body.get("media_urls") != null 
                ? body.get("media_urls").toString() : "[]");
            post.setStatus((String) body.getOrDefault("status", "COMPLETED"));
            if (body.get("event_date") != null && !body.get("event_date").toString().isEmpty()) {
                post.setEventDate(LocalDate.parse(body.get("event_date").toString()));
            }
            if (body.get("deadline") != null && !body.get("deadline").toString().isEmpty()) {
                post.setDeadline(LocalDate.parse(body.get("deadline").toString()));
            }
            post.setIsTopNeeded(body.get("is_top_needed") != null 
                && Boolean.parseBoolean(body.get("is_top_needed").toString()));
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());

            Post saved = postRepository.save(post);
            response.put("success", true);
            response.put("post", saved);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return response;
        }
    }

    // GET top 100 NGOs ranked
    @GetMapping("/top-100")
    public List<Map<String, Object>> getTop100() {
        List<Ngo> ngos = ngoRepository.findByStatus("ACTIVE");
        List<Map<String, Object>> result = new ArrayList<>();

        for (Ngo ngo : ngos) {
            List<Post> ngoPosts = postRepository.findByNgoIdOrderByCreatedAtDesc(ngo.getId());

            BigDecimal totalRaised = ngoPosts.stream()
                .map(p -> p.getFundsRaised() != null ? p.getFundsRaised() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            int postsCount = ngoPosts.size();

            double score = (ngo.getTrustScore() != null ? ngo.getTrustScore() : 0) * 0.5
                + (totalRaised.doubleValue() / 1000.0) * 0.3
                + (postsCount * 2) * 0.2;

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", ngo.getId());
            entry.put("name", ngo.getName());
            entry.put("logo_emoji", ngo.getLogoEmoji());
            entry.put("category", ngo.getCategory());
            entry.put("location", ngo.getLocation());
            entry.put("trust_score", ngo.getTrustScore());
            entry.put("total_raised", totalRaised);
            entry.put("total_posts", postsCount);
            entry.put("score", Math.round(score * 10.0) / 10.0);
            result.add(entry);
        }

        result.sort((a, b) -> Double.compare(
            ((Number) b.get("score")).doubleValue(),
            ((Number) a.get("score")).doubleValue()
        ));

        int rank = 1;
        for (Map<String, Object> entry : result) {
            entry.put("rank", rank++);
        }

        return result.size() > 100 ? result.subList(0, 100) : result;
    }

    // Helper: build post list with NGO embedded
    private List<Map<String, Object>> buildPostList(List<Post> posts) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post post : posts) {
            Optional<Ngo> ngoOpt = ngoRepository.findById(post.getNgoId());
            if (ngoOpt.isPresent() && "ACTIVE".equals(ngoOpt.get().getStatus())) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("id", post.getId());
                entry.put("title", post.getTitle());
                entry.put("summary", post.getSummary());
                entry.put("raw_input", post.getRawInput());
                entry.put("category", post.getCategory());
                entry.put("impact_count", post.getImpactCount());
                entry.put("funds_goal", post.getFundsGoal());
                entry.put("funds_raised", post.getFundsRaised());
                entry.put("volunteers_needed", post.getVolunteersNeeded());
                entry.put("media_urls", post.getMediaUrls());
                entry.put("status", post.getStatus());
                entry.put("event_date", post.getEventDate());
                entry.put("deadline", post.getDeadline());
                entry.put("is_top_needed", post.getIsTopNeeded());
                entry.put("ngo", ngoOpt.get());
                result.add(entry);
            }
        }
        return result;
    }
}