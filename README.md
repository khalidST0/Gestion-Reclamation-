# Gestion des Réclamations - Al Amana Microfinance

## 📌 Description

This project is a web application developed during my internship at **Al Amana Microfinance**.

The application allows clients to submit complaints and enables administrators to manage and respond to them through a secure web interface.

---

## 🛠 Technologies Used

### Frontend
- Angular
- TypeScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- PostgreSQL
- pgAdmin 4

---

## 📂 Project Structure

```
Projet-GR/
│
├── backend/
├── frontend/
├── gestion_reclamation.sql
├── README.md
└── .gitignore
```

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/khalidST0/Gestion-Reclamation-.git
```

---

## 2. Restore the database

Open **pgAdmin 4** and restore the database using:

```
gestion_reclamation.sql
```

---

## 3. Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm start
```

The backend will run on:

```
http://localhost:3000
```

---

## 4. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run Angular:

```bash
ng serve
```

The frontend will run on:

```
http://localhost:4200
```

---

# 🔐 Login Credentials

Administrator Account

Email:

```
admin@test.com
```

Password:

```
123456
```

---

# ✨ Features

- User Authentication (JWT)
- Secure Login
- Dashboard
- Create a Complaint
- Edit Complaint
- Delete Complaint
- Complaint Status Management
- User Management
- Responsive Angular Interface
- PostgreSQL Database Integration

---

# 📄 Database

The SQL database is included in:

```
gestion_reclamation.sql
```

Import this file into PostgreSQL before running the application.

---

# 👨‍💻 Author

**Khalid Taleb**

Internship Project - Al Amana Microfinance
