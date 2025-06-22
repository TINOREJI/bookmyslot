from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from app.database import engine
from app.base import Base
from app.models.event import Event, TimeSlot
from app.models.booking import Booking
from app.routes.events import router as events_router
from app.routes.bookings import router as bookings_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookMySlot API")

# Add CORS middleware here (BEFORE including routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(events_router)
app.include_router(bookings_router)

@app.get("/")
async def root():
    return {"message": "BookMySlot API"}
