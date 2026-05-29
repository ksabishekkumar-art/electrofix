package com.electrofix.backend.controller;

import com.electrofix.backend.entity.ServiceEntity;
import com.electrofix.backend.repository.ServiceRepository;
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
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ServiceEntity> createService(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            ServiceEntity service = new ServiceEntity();
            service.setName(name);
            service.setPrice(price);
            service.setDescription(description);
            service.setCategory(category);
            
            if (image != null && !image.isEmpty()) {
                String imageUrl = fileUploadService.saveFile("services", image);
                service.setImageUrl(imageUrl);
            }
            
            ServiceEntity savedService = serviceRepository.save(service);
            return new ResponseEntity<>(savedService, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Optional<ServiceEntity> optionalService = serviceRepository.findById(id);
        if (optionalService.isPresent()) {
            try {
                ServiceEntity service = optionalService.get();
                service.setName(name);
                service.setPrice(price);
                service.setDescription(description);
                service.setCategory(category);
                
                if (image != null && !image.isEmpty()) {
                    // Delete old image
                    if (service.getImageUrl() != null) {
                        fileUploadService.deleteFile(service.getImageUrl());
                    }
                    String imageUrl = fileUploadService.saveFile("services", image);
                    service.setImageUrl(imageUrl);
                }
                
                ServiceEntity updatedService = serviceRepository.save(service);
                return new ResponseEntity<>(updatedService, HttpStatus.OK);
            } catch (IOException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        Optional<ServiceEntity> optionalService = serviceRepository.findById(id);
        if (optionalService.isPresent()) {
            ServiceEntity service = optionalService.get();
            if (service.getImageUrl() != null) {
                fileUploadService.deleteFile(service.getImageUrl());
            }
            serviceRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
