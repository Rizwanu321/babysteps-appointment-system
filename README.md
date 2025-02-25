# BabySteps Appointment Booking System

A full-stack appointment booking system for prenatal care services built with React, Node.js, Express, and MongoDB. The system allows users to book appointments with doctors based on their availability, manage appointments, and prevent double bookings.

## Features

- 👨‍⚕️ View list of available doctors
- 📅 Check doctor's available time slots
- 🏥 Book appointments with real-time validation
- ✏️ Edit existing appointments
- ❌ Cancel appointments
- 🔄 Real-time updates using WebSocket
- 📊 View appointment statistics

## Tech Stack

### Frontend

- React
- Redux Toolkit for state management
- Tailwind CSS for styling
- Socket.io-client for real-time updates
- Date-fns for date manipulation
- React Icons
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- Date-fns for time slot calculations
- CORS for cross-origin resource sharing

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Rizwanu321/babysteps-appointment-system.git
cd babysteps-appointment-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and other configurations
MONGODB_URI=your_mongodb_uri
PORT=5000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
# In the backend directory
npm run dev
```

The server will start on http://localhost:5000

### 2. Start the Frontend Development Server

```bash
# In the frontend directory
npm start
```

The application will open in your default browser at http://localhost:3000

## Project Structure

```
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id/slots` - Get available slots for a specific doctor

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Design Decisions and Assumptions

### Time Slots

- Appointments are scheduled in 30-minute intervals
- Working hours are from 9:00 AM to 5:00 PM
- Same working hours apply to all days
- Slots are generated based on doctor's availability and existing appointments

### Appointment Types

- Routine Check-Up
- Ultrasound
- Consultation
- Follow-up

### Real-time Updates

- WebSocket connection notifies all clients when:
  - New appointment is booked
  - Existing appointment is updated
  - Appointment is cancelled

### Data Persistence

- Doctor information is stored in MongoDB
- Appointment data includes doctor details for efficient retrieval
- Appointments are indexed by doctorId and date for quick lookups
