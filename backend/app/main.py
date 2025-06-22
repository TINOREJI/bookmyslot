from fastapi import FastAPI
from app.database import engine
from app.base import Base
from app.models.event import Event, TimeSlot
from app.models.booking import Booking

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookMySlot API")

@app.get("/")
async def root():
    return {"message": "BookMySlot API"}