package com.electrofix.backend.controller;

import com.electrofix.backend.entity.ReviewEntity;
import com.electrofix.backend.repository.ReviewRepository;
import com.electrofix.backend.service.EmailService;
import com.electrofix.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<ReviewEntity> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ReviewEntity> createReview(
            @RequestParam("customerName") String customerName,
            @RequestParam("rating") Integer rating,
            @RequestParam("message") String message,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            ReviewEntity review = new ReviewEntity();
            review.setCustomerName(customerName);
            review.setRating(rating);
            review.setMessage(message);
            review.setApproved(false); // Default to not approved
            
            if (image != null && !image.isEmpty()) {
                String imageUrl = fileUploadService.saveFile("reviews", image);
                review.setProfileImage(imageUrl);
            }
            
            ReviewEntity savedReview = reviewRepository.save(review);

            // JARVIS Email Notification
            String content = String.format("<strong>Name:</strong> %s<br/><strong>Rating:</strong> %d / 5<br/><strong>Review:</strong> %s",
                savedReview.getCustomerName(), savedReview.getRating(), savedReview.getMessage());
            emailService.sendAdminNotification("New Review Received", content);

            return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ReviewEntity> approveReview(@PathVariable Long id) {
        Optional<ReviewEntity> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            ReviewEntity review = optionalReview.get();
            review.setApproved(true);
            ReviewEntity updatedReview = reviewRepository.save(review);
            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        Optional<ReviewEntity> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            ReviewEntity review = optionalReview.get();
            if (review.getProfileImage() != null) {
                fileUploadService.deleteFile(review.getProfileImage());
            }
            reviewRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
