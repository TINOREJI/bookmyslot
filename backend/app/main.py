from fastapi import FastAPI
from app.database import engine
from app.base import Base
from app.models.event import Event, TimeSlot
from app.models.booking import Booking
from app.routes.events import router as events_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookMySlot API")

# Include routers
app.include_router(events_router)

@app.get("/")
async def root():
    return {"message": "BookMySlot API"}