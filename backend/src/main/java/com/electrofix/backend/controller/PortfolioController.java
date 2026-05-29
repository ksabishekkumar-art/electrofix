package com.electrofix.backend.controller;

import com.electrofix.backend.entity.PortfolioEntity;
import com.electrofix.backend.repository.PortfolioRepository;
import com.electrofix.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping
    public List<PortfolioEntity> getAllPortfolio() {
        return portfolioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<PortfolioEntity> createPortfolio(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        
        try {
            PortfolioEntity portfolio = new PortfolioEntity();
            portfolio.setTitle(title);
            portfolio.setCategory(category);
            portfolio.setDescription(description);
            
            if (images != null && !images.isEmpty()) {
                List<String> uploadedImages = new ArrayList<>();
                for (MultipartFile img : images) {
                    if (!img.isEmpty()) {
                        String url = fileUploadService.saveFile("portfolio", img);
                        uploadedImages.add(url);
                    }
                }
                portfolio.setImageUrls(uploadedImages);
                if (!uploadedImages.isEmpty()) {
                    portfolio.setImageUrl(uploadedImages.get(0)); // Set first as primary
                }
            }

            if (video != null && !video.isEmpty()) {
                String videoUrl = fileUploadService.saveFile("portfolio/videos", video);
                portfolio.setVideoUrl(videoUrl);
            }
            
            PortfolioEntity savedPortfolio = portfolioRepository.save(portfolio);
            return new ResponseEntity<>(savedPortfolio, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioEntity> updatePortfolio(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        
        Optional<PortfolioEntity> optionalPortfolio = portfolioRepository.findById(id);
        if (optionalPortfolio.isPresent()) {
            try {
                PortfolioEntity portfolio = optionalPortfolio.get();
                portfolio.setTitle(title);
                portfolio.setCategory(category);
                portfolio.setDescription(description);
                
                if (images != null && !images.isEmpty()) {
                    if (portfolio.getImageUrls() != null) {
                        for (String url : portfolio.getImageUrls()) {
                            fileUploadService.deleteFile(url);
                        }
                    }
                    List<String> uploadedImages = new ArrayList<>();
                    for (MultipartFile img : images) {
                        if (!img.isEmpty()) {
                            String url = fileUploadService.saveFile("portfolio", img);
                            uploadedImages.add(url);
                        }
                    }
                    portfolio.setImageUrls(uploadedImages);
                    if (!uploadedImages.isEmpty()) {
                        portfolio.setImageUrl(uploadedImages.get(0));
                    }
                }

                if (video != null && !video.isEmpty()) {
                    if (portfolio.getVideoUrl() != null) {
                        fileUploadService.deleteFile(portfolio.getVideoUrl());
                    }
                    String videoUrl = fileUploadService.saveFile("portfolio/videos", video);
                    portfolio.setVideoUrl(videoUrl);
                }
                
                PortfolioEntity updatedPortfolio = portfolioRepository.save(portfolio);
                return new ResponseEntity<>(updatedPortfolio, HttpStatus.OK);
            } catch (IOException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        Optional<PortfolioEntity> optionalPortfolio = portfolioRepository.findById(id);
        if (optionalPortfolio.isPresent()) {
            PortfolioEntity portfolio = optionalPortfolio.get();
            if (portfolio.getImageUrls() != null) {
                for (String url : portfolio.getImageUrls()) {
                    fileUploadService.deleteFile(url);
                }
            } else if (portfolio.getImageUrl() != null) {
                fileUploadService.deleteFile(portfolio.getImageUrl());
            }
            if (portfolio.getVideoUrl() != null) {
                fileUploadService.deleteFile(portfolio.getVideoUrl());
            }
            portfolioRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
