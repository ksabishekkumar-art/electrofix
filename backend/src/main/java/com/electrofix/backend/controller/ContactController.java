package com.electrofix.backend.controller;

import com.electrofix.backend.entity.ContactEntity;
import com.electrofix.backend.repository.ContactRepository;
import com.electrofix.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<ContactEntity> getAllContacts() {
        return contactRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ContactEntity> createContact(@RequestBody ContactEntity contact) {
        ContactEntity savedContact = contactRepository.save(contact);
        
        // JARVIS Email Notification
        String content = String.format("<strong>Name:</strong> %s<br/><strong>Email:</strong> %s<br/><strong>Message:</strong> %s",
            savedContact.getName(), savedContact.getEmail(), savedContact.getMessage());
        emailService.sendAdminNotification("New Contact Request", content);

        return new ResponseEntity<>(savedContact, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        Optional<ContactEntity> optionalContact = contactRepository.findById(id);
        if (optionalContact.isPresent()) {
            contactRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
