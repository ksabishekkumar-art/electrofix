package com.electrofix.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAdminNotification(String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo("kabishekks@gmail.com");
            helper.setSubject("SYSTEM ALERT: " + subject);
            
            String htmlContent = "<div style=\"background-color:#0a0a0f; color:#e0fbfc; font-family:Arial, sans-serif; padding:20px; border:2px solid #00e5ff; border-radius:5px;\">" +
                "<h2 style=\"color:#38f9ff; text-transform:uppercase;\">ElectroFix Protocol</h2>" +
                "<p style=\"color:#ffb400; font-weight:bold;\">New Database Entry Detected</p>" +
                "<div style=\"background-color:rgba(0, 229, 255, 0.1); padding:15px; border-left:4px solid #00e5ff;\">" +
                content +
                "</div>" +
                "<br/><p style=\"color:#8d99ae; font-size:12px;\">JARVIS Automated System - Do not reply directly.</p>" +
                "</div>";
                
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send email notification: " + e.getMessage());
        }
    }
}
