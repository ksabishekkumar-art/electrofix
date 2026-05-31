package com.electrofix.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl; // Kept for backward compatibility or primary image

    @ElementCollection
    @CollectionTable(name = "portfolio_images", joinColumns = @JoinColumn(name = "portfolio_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getImageUrl() {
        if (this.imageUrl != null && this.imageUrl.startsWith("http://localhost:8080")) {
            return this.imageUrl.replace("http://localhost:8080", "");
        }
        return this.imageUrl;
    }

    public List<String> getImageUrls() {
        if (this.imageUrls == null) return new ArrayList<>();
        List<String> cleaned = new ArrayList<>();
        for (String url : this.imageUrls) {
            if (url != null && url.startsWith("http://localhost:8080")) {
                cleaned.add(url.replace("http://localhost:8080", ""));
            } else {
                cleaned.add(url);
            }
        }
        return cleaned;
    }

    public String getVideoUrl() {
        if (this.videoUrl != null && this.videoUrl.startsWith("http://localhost:8080")) {
            return this.videoUrl.replace("http://localhost:8080", "");
        }
        return this.videoUrl;
    }
}
