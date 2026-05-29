# 📂 ElectroFix Project Structure

```text
Electrofix/
├── .gitignore
├── README.md
├── DEPLOYMENT_GUIDE.md
├── PROJECT_STRUCTURE.md
├── frontend/                     # Vanilla JS + CSS Frontend
│   ├── css/
│   │   └── style.css             # Global Iron Man / JARVIS Theme
│   ├── js/
│   │   ├── api.js                # Environment config & centralized API endpoints
│   │   ├── main.js               # Frontend animations & core logic
│   │   └── admin.js              # Admin Dashboard logic
│   ├── index.html                # Landing Page
│   ├── services.html             # Services Page
│   ├── portfolio.html            # Dynamic Media Portfolio
│   ├── reviews.html              # Customer Reviews
│   ├── contact.html              # Contact Forms
│   ├── tracking.html             # Live Service Timeline Tracking
│   ├── admindashboard.html       # Full Admin Control Panel
│   ├── manifest.json             # PWA Configuration
│   ├── sw.js                     # PWA Service Worker
│   └── offline.html              # Fallback Offline Page
└── backend/                      # Spring Boot Java Backend
    ├── build.gradle              # Gradle Build Script
    ├── src/main/java/com/electrofix/backend/
    │   ├── config/               # WebConfig (CORS), Email Config
    │   ├── controller/           # REST APIs (Booking, Contact, Portfolio, etc.)
    │   ├── entity/               # JPA Entities (DB Models)
    │   ├── exception/            # GlobalExceptionHandler
    │   ├── repository/           # Spring Data JPA Repositories
    │   └── service/              # Business Logic & EmailService
    └── src/main/resources/
        └── application.properties # Server port, MySQL, Gmail SMTP config
```
