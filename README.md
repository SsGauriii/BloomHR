# 🌿 BloomHR — Real-World HR Dashboard

A production-ready HR management platform built with React + Spring Boot + PostgreSQL.

## Tech Stack
- **Frontend**: React 18, Vite, CSS Modules
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT
- **Database**: PostgreSQL
- **Email**: JavaMail (SMTP)
- **Auth**: JWT + Refresh Tokens

## Project Structure
```
bloomhr/
├── frontend/          # React app (Vite)
├── backend/           # Spring Boot API
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 14+

---

## Backend Setup (Spring Boot)

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE bloomhr;
CREATE USER bloomhr_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bloomhr TO bloomhr_user;
```

### 2. Configure application.properties
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bloomhr
spring.datasource.username=bloomhr_user
spring.datasource.password=your_password

jwt.secret=your-256-bit-secret-key-here-make-it-long
jwt.expiration=86400000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your@gmail.com
spring.mail.password=your-app-password
```

### 3. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on http://localhost:8080

---

## Frontend Setup (React + Vite)

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8080/api
```

### 3. Run Frontend
```bash
npm run dev
```
Frontend runs on http://localhost:5173

---

## 🌐 Deployment (Production)

### Backend → Railway / Render
1. Push to GitHub
2. Connect repo to Railway.app
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy → get public URL

### Frontend → Vercel / Netlify
1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel
3. Set `VITE_API_URL` to your Railway backend URL

---



---

## Default Admin Account
After first run, create admin via:
```
POST /api/auth/register
{
  "email": "admin@yourcompany.com",
  "password": "SecurePass123!",
  "name": "HR Admin",
  "role": "HR"
}
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login | None |
| POST | /api/auth/register | Register | None |
| GET | /api/employees | List all employees | HR/Employee |
| POST | /api/employees | Add employee | HR |
| PUT | /api/employees/{id} | Update employee | HR/Owner |
| DELETE | /api/employees/{id} | Delete employee | HR |
| GET | /api/employees/me | My profile | Employee |
| PUT | /api/employees/me | Update my profile | Employee |
| POST | /api/contact/send | Send HR email | Any |
| GET | /api/dashboard/stats | Dashboard stats | HR |

