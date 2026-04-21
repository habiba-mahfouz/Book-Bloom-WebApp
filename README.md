# 📚 Book Bloom - Online Bookstore

**Book Bloom** is a comprehensive, full-stack E-Commerce web application designed for an online bookstore. It features a responsive user interface with dedicated user and employee dashboards, along with an integrated Node.js backend.

## ✨ Features
- **User Authentication:** Secure Login and Signup functionality.
- **Role-based Access:** Dedicated interfaces for standard users and bookstore employees.
- **Book Categories:** Browse various genres including Computer Science, Python Programming, Software Engineering, Space, World History, and more.
- **Shopping Cart & Checkout:** Interactive cart management and order processing screens.
- **User Profile Management:** Dynamic user profile rendering featuring custom avatars.
- **Backend API:** A customized Node.js (Express) server that manages login/signup routes and safely handles data in a localized JSON database.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Local JSON File (`users.json`)
- **Middleware:** `cors`, `body-parser`

## 🚀 How to Run Locally

If you'd like to test this project on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/habiba-mahfouz/Book-Bloom-WebApp.git
   ```

2. **Install the required backend dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run the following in the project terminal:
   ```bash
   npm install express cors body-parser
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```
   *The server will start running on `http://localhost:3000`*

4. **Open the Application:**
   Open the `login/login.html` file in your browser to start the journey!

## 📂 Key Project Structure
- `server.js` - Main Express server running the authentication API.
- `users.json` - JSON file acting as a mock database.
- `/login` & `/signup` - User Authentication screens.
- `/checkout` & `/paymentdetails` - Order processing.
- `/shoppingcart` & `/OrderList` - Managing user orders.
- `/MainMenu` & `/EmployeeMainMenu` - Hubs for navigating the app.
- `/userprofile` & `/UserManage` - Client and Admin profile management.
