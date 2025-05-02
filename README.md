
# 🛠️ **ServiceHub**

**ServiceHub** is a full-stack service booking platform built with **Node.js**, **MongoDB**, and styled using **Tailwind CSS**. This platform allows users to register, verify their email, and book services like electricians and plumbers. Workers can also join the platform through a submission form.

---

## 🏗️ **Features**

- **User Registration** 
- **Password Validation** 
- Secure **OTP Verification** 
- **Worker Join Form**
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Modern, responsive design with Tailwind CSS
- **Email Verification** using dynamic, friendly messages

---

## 🧑‍💻 **Tech Stack**

- **Frontend**: HTML5, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Email Service**: Nodemailer
- **Authentication**: JWT-based token for secure user management

---

## 📁 **Folder Structure**

```
servicehub/
├── routes/                 # API routes
    └── authRoutes.js       # User-related routes (e.g., register, verify)
├── public/                 # MongoDB models
    └── joinus.html         # Worker registration form
├── models/                 # MongoDB models
    └── User.js             # User schema and model
    └── Worker.js           # Worker schema and model
├── controllers/            # Business logic for handling requests
    └── authController.js   # All logics written here
├── .env                    # Environment variables
├── server.js               # Express server setup
├── index.html              # Home Page
├── userform.html           # Login/Signup Form Page
├── verify.html             # Email Verification Page
└── README.md               # Project documentation
```

---

## ⚙️ **Setup Instructions**

To run this project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sakthi0807/ServiceHub.git
   cd ServiceHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root of the project.
   - Add the following environment variables:
     ```
     MONGO_URI=your_mongo_connection_string
     PORT=5000
     ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. Open the app in your browser at `http://localhost:PORT` and start using it!

---

## ✨ **Future Improvements**

- OTP-based phone number verification
- User and worker dashboards
- Admin panel for managing services and bookings
- Chat functionality between users and service providers

---

## 🙋‍♂️ **Author**

Made with ❤️ by **[Sakthivel](https://github.com/Sakthi0807)**  
Feel free to **fork**, **contribute**, or **open an issue**.

---

## 📄 **License**

This project is licensed under the [MIT License](LICENSE).
```
