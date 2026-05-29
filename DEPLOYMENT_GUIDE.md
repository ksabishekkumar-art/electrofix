# 🚀 ElectroFix Deployment Guide

This guide provides step-by-step instructions for deploying ElectroFix to a production environment. The recommended stack uses **Vercel** for the frontend, **Railway or Render** for the backend, and **Aiven or Railway** for the MySQL database.

---

## 📦 1. Database Deployment (Railway / Aiven)
1. Create an account on [Railway.app](https://railway.app/).
2. Click **New Project** -> **Provision MySQL**.
3. Once provisioned, click on the MySQL service and copy the **Connection URL**, **Username**, and **Password**.
4. Save these credentials; you will need them for the backend.

---

## ⚙️ 2. Backend Deployment (Render / Railway)
### Option A: Deploy on Render
1. Create a free account on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Click **New** -> **Web Service**.
4. Select the `backend` directory (if using Monorepo, define root directory as `/backend`).
5. Set the Build Command: `./gradlew build -x test`
6. Set the Start Command: `java -jar build/libs/backend-0.0.1-SNAPSHOT.jar`
7. Add Environment Variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://<RAILWAY_HOST>:<PORT>/railway`
   - `SPRING_DATASOURCE_USERNAME` = `<DB_USER>`
   - `SPRING_DATASOURCE_PASSWORD` = `<DB_PASS>`
   - `SPRING_PROFILES_ACTIVE` = `prod`
8. Deploy!

---

## 🌐 3. Frontend Deployment (Vercel)
1. Open `frontend/js/api.js`.
2. Ensure you set `const ENV = "production";`.
3. Update the production `API_BASE_URL` in `api.js` to point to your new Render/Railway backend URL (e.g., `https://electrofix-api.onrender.com/api`).
4. Log into [Vercel](https://vercel.com).
5. Import your GitHub repository.
6. Set the **Root Directory** to `frontend`.
7. Click **Deploy**.

---

## 🔒 4. Production Checklist
- [ ] CORS is correctly configured in `WebConfig.java` to allow requests ONLY from your Vercel URL.
- [ ] You have generated an App Password for Gmail and added it to the production environment variables (`spring.mail.password`).
- [ ] The MySQL database schema successfully auto-generated via Hibernate.
