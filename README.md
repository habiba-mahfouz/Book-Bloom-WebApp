# 📚 Book Bloom - Online Bookstore

**Book Bloom** is a comprehensive, full-stack E-Commerce web application designed for an online bookstore. It features a responsive user interface with dedicated user and employee dashboards, along with an integrated Node.js backend.
<img width="1859" height="870" alt="Screenshot 2026-04-21 080938" src="https://github.com/user-attachments/assets/cf1667de-caec-4436-9e86-19177ea27401" />

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
- `/document` - Pre-implementation design studies, containing PDFs of system analysis and software design.

## 📄 Pre-Implementation Study & System Design

To ensure a structured and well-analyzed implementation, a detailed system analysis and architectural study were conducted prior to writing the code. The documentation for this pre-implementation phase is located in the `/document` folder:
- **`Software Phase 1-2.pdf`**: Outlines the project goals, functional requirements, scope (in-scope and out-of-scope), stakeholder definitions, and the choice of the Agile development model.
- **`Software Phase 3.pdf`**: Contains technical diagrams mapping out system behaviors and data flows:
  - **Data Flow Diagrams (DFD)** Level 0 and Level 1.
  - **UML Sequence Diagrams** for key features: Employee Login/Book Management, Manager Login/Employee Management, and User Checkout/Payment flows.
  - **Class Diagram** representing the Book Bloom Library architecture.
  - **Use Case Diagram** mapping user, employee, and manager interactions.
  - **Entity Relationship Diagram (ERD)** for the data model layout.
