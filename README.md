# BookMySlot

A full-stack event booking platform built with FastAPI (Python) for the backend and React + Vite + Tailwind CSS for the frontend.
![image](https://github.com/user-attachments/assets/03458b32-3a05-41c2-a4c7-0398b14f4de7)

## Features

- Create, list, and manage events with multiple time slots
- Real-time slot availability and booking limits
- Prevents overbooking and double booking
- Responsive, modern UI with Tailwind CSS
- View your bookings by email
- Robust backend with FastAPI and SQLAlchemy
- Clean REST API structure

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Version Control**: Git (separate branches for backend and frontend)

## Why this Tech Stack
I chose React (with Vite and Tailwind CSS) and FastAPI with SQLAlchemy because they are modern, efficient, and widely used for building robust, scalable full-stack web applications. This stack enables rapid development, real-time interactivity, and clean API integration.

## APIs Implemented:

 - Create event with multiple slots

 - List all events with slot availability

 - Get event details (with per-slot bookings)

 - Book a slot (with overbooking/double-booking prevention)

 - List bookings for a user by email

## Project Structure
```bash
bookmyslot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── base.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── event.py
│   │   │   ├── booking.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── events.py
│   │   │   ├── bookings.py
│   ├── db.sqlite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/TINOREJI/bookmyslot.git
cd bookmyslot
```
## Backend Setup
```bash 
cd backend
python -m venv venv
venv\Scripts\activate  On Windows; use source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
```
```bash 
uvicorn app.main:app --reload
```

The API will be live at http://127.0.0.1:8000.

## Frontend Setup
```bash 
cd ../frontend
npm install
npm run dev
```

The frontend will be live at http://localhost:5173.
![image](https://github.com/user-attachments/assets/8740cf45-34fd-4f6f-b493-11bd25737375)
![image](https://github.com/user-attachments/assets/ded127ee-98c6-4a81-9f00-acce4e5248e0)
![image](https://github.com/user-attachments/assets/f39f5c24-fe23-43fb-a418-4799117cd543)


## Usage

- Create Event: Add a new event with one or more time slots.
- Book Slot: Users can book available slots; the system prevents overbooking and double-booking.
- View Events: See all events, live availability, and booking progress.
- My Bookings: Enter your email to view your bookings.

## Development Workflow
Version Control

-Separate branches for backend (feature/backend-setup) and frontend (feature/frontend-setup)

Best Practices

- Centralized API calls
- Reusable React components
- Clean, readable code
- Responsive and accessible UI

## License
This project is licensed under the MIT License.
