# 🚀 ElectroFix

ElectroFix is a premium, high-performance web application designed for professional electrician services. It features a fully responsive, **Iron Man / JARVIS-inspired futuristic UI**, powered by a robust Spring Boot backend and an ultra-fast Vanilla JS frontend.

## ✨ Features
- **Futuristic UI/UX**: Dark mode, glassmorphism, neon glows, and JARVIS-style animations.
- **Service Booking**: Instant service request forms with WhatsApp integration.
- **Live Tracking System**: Customers can track their booking status in real-time via an animated timeline.
- **Dynamic Portfolio**: Multimedia gallery supporting both images and video uploads.
- **Admin Dashboard**: Full CRUD management with live analytics and status control.
- **PWA Ready**: Installable as a progressive web app with offline fallback support.
- **Email & WhatsApp Notifications**: Automated alerts for admins and customers.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, CSS3 (No external bloated frameworks)
- **Backend**: Java 17, Spring Boot 3
- **Database**: MySQL Server
- **APIs**: RESTful architecture, JavaMailSender for SMTP
- **Effects**: Particles.js, Chart.js

## 💻 Installation & Local Setup

### 1. Database Setup
1. Install MySQL and create a database named `electrofix_db2`.
2. Ensure your local MySQL credentials match those in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/electrofix_db2
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Run the Spring Boot application using Gradle:
   ```bash
   ./gradlew bootRun
   ```
3. The server will start on `http://localhost:8080`.

### 3. Frontend Setup
1. The frontend consists of static files. You can serve them using any local server (e.g., VS Code Live Server).
2. Open `frontend/js/api.js` and ensure `ENV = "development"` is set to point to your local backend.

## 🚀 Deployment Steps
Please refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying this application to platforms like Vercel, Render, and AWS.

## 📸 Screenshots
*(Add screenshots of the Home Page, Admin Dashboard, and Tracking System here)*

## 🤝 Credits
Designed and Developed with advanced agentic AI capabilities.
