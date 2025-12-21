# 🚗 Parking Management System (JavaScript)

A simple and efficient **Parking Management System** built using **HTML, CSS, and Vanilla JavaScript**.  
The platform allows **users** to reserve parking places and **admins** to manage users, places, reservations, payments, and view statistics through a dashboard.

---
https://rayane-fng.github.io/parking-system-management/

## 📌 Features

### 👤 User Features
- User authentication (login)
- Make a parking reservation
- Choose arrival and departure time
- View personal reservations
- View total amount to pay
- Access a personal dashboard

### 🛠️ Admin Features
- Admin authentication
- Manage users (view, add, delete)
- Manage parking places
- Manage reservations
- Manage payments
- View statistics and charts (Chart.js)
- Admin dashboard with KPIs

---

## 🧰 Technologies Used
- **HTML5** – Page structure
- **CSS3** – Styling and responsive layout
- **JavaScript (Vanilla)** – Application logic
- **LocalStorage** – Data persistence
- **Chart.js** – Charts and statistics

---

## 📁 Project Structure
parking-management/
│
├── index.html
├── dashboard.html
├── users.html
├── places.html
├── reservations.html
├── vehicles.html
├── payments.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── data.js
│       ├── users.js
│       ├── places.js
│       ├── reservations.js
│       ├── payments.js
│       └── dashboard.js
│
├── components/
│   ├── navbar.html
│   └── sidebar.html
│
└── README.md

---

## 🔐 Authentication
- Two roles: **Admin** and **User**
- Authentication logic handled in `auth.js`
- User session managed using `localStorage`

---

## 💾 Data Storage
All data is stored locally in the browser using **LocalStorage**:
- Users
- Parking places
- Reservations
- Payments

⚠️ No backend is used (educational purpose).

---

## 📊 Dashboard & Statistics
- Charts display:
  - Number of reservations
  - Payments
  - Parking occupancy
- Implemented using **Chart.js**

---

## ▶️ How to Run the Project
1. Clone or download the repository
2. Open `index.html` in your browser
3. Login as **Admin** or **User**
4. Start managing parking reservations

---

## 🎓 Educational Purpose
This project was created as a **student project** to:
- Practice **JavaScript CRUD operations**
- Understand **front-end logic**
- Learn **role-based access**
- Build a complete mini-management system

---

## 📄 License
This project is for **educational use only**.
