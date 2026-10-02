package com.template.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ngo_id", nullable = false)
    private Long ngoId;

    @Column(name = "posted_by")
    private String postedBy;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "raw_input", columnDefinition = "LONGTEXT")
    private String rawInput;

    private String category;

    @Column(name = "impact_count")
    private Integer impactCount;

    @Column(name = "funds_goal")
    private BigDecimal fundsGoal;

    @Column(name = "funds_raised")
    private BigDecimal fundsRaised;

    @Column(name = "volunteers_needed")
    private Integer volunteersNeeded;

    @Column(name = "media_urls", columnDefinition = "LONGTEXT")
    private String mediaUrls;

    private String status;

    @Column(name = "event_date")
    private LocalDate eventDate;

    private LocalDate deadline;

    @Column(name = "is_top_needed")
    private Boolean isTopNeeded;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNgoId() { return ngoId; }
    public void setNgoId(Long ngoId) { this.ngoId = ngoId; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getRawInput() { return rawInput; }
    public void setRawInput(String rawInput) { this.rawInput = rawInput; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getImpactCount() { return impactCount; }
    public void setImpactCount(Integer impactCount) { this.impactCount = impactCount; }

    public BigDecimal getFundsGoal() { return fundsGoal; }
    public void setFundsGoal(BigDecimal fundsGoal) { this.fundsGoal = fundsGoal; }

    public BigDecimal getFundsRaised() { return fundsRaised; }
    public void setFundsRaised(BigDecimal fundsRaised) { this.fundsRaised = fundsRaised; }

    public Integer getVolunteersNeeded() { return volunteersNeeded; }
    public void setVolunteersNeeded(Integer volunteersNeeded) { this.volunteersNeeded = volunteersNeeded; }

    public String getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(String mediaUrls) { this.mediaUrls = mediaUrls; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Boolean getIsTopNeeded() { return isTopNeeded; }
    public void setIsTopNeeded(Boolean isTopNeeded) { this.isTopNeeded = isTopNeeded; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}