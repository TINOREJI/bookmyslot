from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from app.database import engine
from app.base import Base
from app.models.event import Event, TimeSlot
from app.models.booking import Booking
from app.routes.events import router as events_router
from app.routes.bookings import router as bookings_router
import os
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookMySlot API by Tino Abraham Reji")
# Configure CORS
allowed_origin = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").strip()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events_router)
app.include_router(bookings_router)

@app.get("/")
async def root():
    return {"message": "BookMySlot API"}
