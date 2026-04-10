# FinTech Dashboard Backend

A production-grade backend for a finance dashboard system built with **Node.js**, **Express.js**, and **MongoDB**. This system implements full Role-Based Access Control (RBAC), secure authentication, and complex data aggregation for financial insights.

---

## 🚀 Key Features

- **🔐 Robust Security**:
  - JWT-based Authentication.
  - Role-Based Access Control (RBAC) with three levels: `Viewer`, `Analyst`, and `Admin`.
  - Password hashing via `bcryptjs`.
  - Security headers using `helmet` and Rate Limiting for API protection.
- **📊 Real-time Financial Insights**:
  - Complex MongoDB aggregation pipelines for total income, expenses, and net balance.
  - Category-wise expense and income distribution.
  - Recent activity tracking.
- **💼 Records Management**:
  - Full CRUD for financial entries.
  - Advanced filtering by date range, type, and category.
  - Full-text search support for notes.
  - **Soft Delete** functionality to preserve data history.
- **🛠️ Resilient Database Architecture**:
  - Seamlessly connects to **MongoDB Atlas**.
  - **Auto-Fallback**: Automatically spins up an in-memory database if the remote cluster is unreachable, ensuring zero downtime for development.
- **📖 API Documentation**:
  - Fully documented endpoints using **Swagger/OpenAPI 3.0**.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Documentation**: Swagger UI
- **Validation**: Express-Validator
- **Testing/Local DB**: MongoDB Memory Server

---

## 📂 Project Structure

```text
├── src/
│   ├── config/          # Database and Swagger configurations
│   ├── controllers/     # Business logic for each feature
│   ├── middlewares/     # Auth, Role-check, and Error handling
│   ├── models/          # Mongoose Schemas (User, Record)
│   ├── routes/          # Express route definitions
│   └── app.js           # Express app configuration
├── seeder.js            # Initial data population script
├── server.js            # Entry point for the server
└── .env                 # Environment variables (Ignored by Git)
```

---

## 🚦 Quick Start

### 1. Prerequisites
- Node.js (v14+)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/ankitTiwari2002/FinTech.git
cd FinTech
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
```
*Note: If `MONGODB_URI` is left blank, the system will use a temporary in-memory database.*

### 4. Run the Application
```bash
# Development mode with auto-restart
npm run dev

# Start server
npm start
```

### 5. API Documentation
Once the server is running, explore the API at:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ☁️ Deployment

The project is optimized for **Vercel** serverless deployment. 

**Live Link**: [https://fin-tech-rho.vercel.app/api-docs/](https://fin-tech-rho.vercel.app/api-docs/)

Key configurations:
- **`vercel.json`**: For routing and runtime setup.
- **Connection Caching**: Database connections are cached to optimize performance in serverless functions.
- **CDN Swagger**: Uses a CDN for Swagger UI assets to ensure compatibility with Vercel's MIME type handling.

---

## 👥 Roles & Permissions

| Feature | Viewer | Analyst | Admin |
| :--- | :---: | :---: | :---: |
| View Dashboard Summary | ✅ | ✅ | ✅ |
| View All Records | ❌ | ✅ | ✅ |
| Create/Edit Records | ❌ | ❌ | ✅ |
| Delete Records (Soft) | ❌ | ❌ | ✅ |
| Manage User Status/Roles | ❌ | ❌ | ✅ |

---

## 🧪 Testing Credentials (Seeded Data)

The system comes with a seeder script (`npm run seed`) that creates the following users for testing:

- **Admin**: `admin@fintech.com` / `password123`
- **Analyst**: `analyst@fintech.com` / `password123`
- **Viewer**: `viewer@fintech.com` / `password123`

---

## 📝 License
This project is licensed under the ISC License.
