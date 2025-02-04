# Quantum-IT-Innovation-Assessment
Full Stack Development-Machine Test


# Setup Instructions

**Clone the Repository:**
->git clone https://github.com/FireKatty/Quantum-IT-Innovation-Assessment

**Install Dependencies: Ensure you have Node.js installed, then run:**
->cd frontend && npm install && cd ../backend && npm install


**Environment Variables: Create a .env file at the root of the project and add the following:**
->PORT = 9876 // change port number in frontend url if u give different port no.
->JWT_KEY = your_jwt_secret // give a jwt key for token generation
->MONGO_URL=mongodb://localhost:27017/Quantum-IT-Innovation-Assessment



**Run the Application: To start the server, run:**
->npm start


#### Features Overview

1. **User Registration (Signup)**
Users can sign up by providing their name, email, password, and role.
The system ensures passwords match and validates email uniqueness.

2. **Login**
Users log in with their email and password.
A JWT token is generated upon successful login, allowing access to protected routes.

3. **Role Management**
Admins can assign roles to users and update their permissions.
Each role has a defined set of permissions to control access to various resources.

4. **User Management (CRUD Operations)**
Admins can create, read, update, and delete users.
Each user’s information (such as name, email, phone number, and role) can be edited.

5. **Status Management**
Admins can toggle a user’s status between 'Active' and 'Inactive' to control access.
Security Considerations
JWT Authentication: Ensures that only authorized users can access certain routes.
Input Validation: Prevents invalid data entry and mitigates risks such as XSS and SQL Injection.
Password Hashing: Passwords are securely hashed using bcrypt before being stored in the database.

