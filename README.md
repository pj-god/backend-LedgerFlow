# LedgerFlow 💳

A secure banking and ledger management backend built using Node.js, Express.js, MongoDB, JWT, and Nodemailer. The system enables users to create accounts, manage balances, perform financial transactions, and maintain a complete ledger of all account activities with automated email notifications for security and transparency.

---

## 🚀 Features

- User Registration & Authentication
- JWT-Based Authorization
- Secure Password Hashing using bcrypt
- Account Creation & Management
- Deposit Funds
- Withdraw Funds
- Multi-Currency Support
- Transfer Funds Between Accounts
- Transaction History Tracking
- Automatic Balance Calculation
- Double-Entry Ledger System
- Login Email Notifications
- Successful Transaction Email Alerts
- Failed Transaction Email Alerts
- Protected Routes & Middleware
- MongoDB Aggregation Pipelines
- Error Handling & Validation

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt

### Communication
- Nodemailer

### Utilities
- dotenv

---

## 📊 Core Functionalities

### User Authentication

- Register new users
- Secure login system
- Password encryption using bcrypt
- JWT token generation and verification

### Account Management

- Create and manage accounts
- Retrieve account information
- View current account balance

### Transactions

- Deposit money
- Withdraw money
- Transfer funds between accounts
- Record all financial activities

### Ledger System

Every transaction is recorded as a ledger entry to ensure accurate financial tracking.

- Credit Entries
- Debit Entries
- Running Balance Calculation
- Immutable Transaction History

---

## 📧 Email Notification System

The application uses Nodemailer to notify users about important account activities.

### Login Alerts

Users receive an email whenever a successful login occurs, helping them monitor account access and identify suspicious activity.

### Successful Transaction Notifications

Emails are automatically sent after successful deposits, withdrawals, or transfers containing relevant transaction details.

### Failed Transaction Notifications

If a transaction fails due to insufficient balance or other validation issues, users are notified via email with the reason for failure.

---

## 🔐 Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Input Validation
- Transaction Verification
- Email-Based Activity Monitoring

---

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/pj-god/ledgerx-api.git

```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables as shown in .env.example

### Run the Server

```bash
npm run dev
```
---

## 🔮 Future Improvements

- PDF Account Statements
- Scheduled Transactions
- Admin Dashboard
- Transaction Analytics
- OTP Verification
- Fraud Detection Alerts

---
