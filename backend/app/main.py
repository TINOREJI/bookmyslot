import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.base import Base
from app.routes.events import router as events_router
from app.routes.bookings import router as bookings_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookMySlot API by Tino Abraham Reji")

# Get frontend URL from environment variable
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173").strip()
print(f"Allowing CORS for: {frontend_url}")  # Add this for debugging

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events_router)
app.include_router(bookings_router)

@app.get("/")
async def root():
    return {"message": "BookMySlot API by Tino Abraham Reji is running!"}
