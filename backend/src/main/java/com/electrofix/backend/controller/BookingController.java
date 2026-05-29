package com.electrofix.backend.controller;

import com.electrofix.backend.entity.BookingEntity;
import com.electrofix.backend.repository.BookingRepository;
import com.electrofix.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<BookingEntity> createBooking(@RequestBody BookingEntity booking) {
        BookingEntity savedBooking = bookingRepository.save(booking);
        
        // JARVIS Email Notification
        String content = String.format("<strong>Name:</strong> %s<br/><strong>Service:</strong> %s<br/><strong>Address:</strong> %s<br/><strong>Phone:</strong> %s<br/><strong>Message:</strong> %s",
            savedBooking.getCustomerName(), savedBooking.getSelectedService(), savedBooking.getAddress(), savedBooking.getPhone(), savedBooking.getMessage());
        emailService.sendAdminNotification("New Booking Received", content);
        
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<BookingEntity> trackBooking(@PathVariable Long id, @RequestParam String phone) {
        Optional<BookingEntity> optionalBooking = bookingRepository.findByIdAndPhone(id, phone);
        return optionalBooking.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<BookingEntity> updateBookingStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> updates) {
        Optional<BookingEntity> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            BookingEntity booking = optionalBooking.get();
            if (updates.containsKey("bookingStatus")) booking.setBookingStatus(updates.get("bookingStatus"));
            if (updates.containsKey("technicianName")) booking.setTechnicianName(updates.get("technicianName"));
            if (updates.containsKey("estimatedArrivalTime")) booking.setEstimatedArrivalTime(updates.get("estimatedArrivalTime"));
            return new ResponseEntity<>(bookingRepository.save(booking), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        Optional<BookingEntity> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            bookingRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
