# StayNest

[![Deploy Status](https://img.shields.io/badge/deployed-on-Render-brightgreen)](https://staynest-j63u.onrender.com)

StayNest is a full-stack web application for property rental and bookings, similar to Airbnb. Users can browse listings, upload properties, make bookings, and manage reservations.

## Live Demo
🌐 [StayNest Live](https://staynest-j63u.onrender.com)

---

## Features

- User authentication and session management
- Property listing with images and details
- Booking system for properties
- MongoDB and MySQL integration
- Responsive UI built with **EJS** and **Tailwind CSS**
- Secure password storage using **bcrypt**
- File upload support with **Multer**

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, Tailwind CSS  
- **Database:** MongoDB & MySQL  
- **Authentication:** Express-Session, Bcrypt  
- **File Upload:** Multer  
- **Hosting:** Render  

---

## Installation & Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Manish3452/stayNest.git
cd stayNest

2. Install dependencies:
npm install

3. Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_connection_string
MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
SESSION_SECRET=your_session_secret

4. Build Tailwind CSS (for development):
npm run dev

5. Start the server:
npm start

6. Visit http://localhost:3000
 to view the app locally.
