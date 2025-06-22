from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.event import Event, TimeSlot, EventCreate, EventListResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/events", tags=["events"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=EventListResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """Create an event with time slots."""
    db_event = Event(
        title=event.title,
        description=event.description,
        created_at=datetime.utcnow()
    )
    db.add(db_event)
    db.flush()  # Get event ID before adding slots

    for slot in event.slots:
        db_slot = TimeSlot(
            event_id=db_event.id,
            start_time=slot.start_time,
            max_bookings=slot.max_bookings
        )
        db.add(db_slot)

    db.commit()
    db.refresh(db_event)

    # Calculate total and available slots
    total_slots = len(db_event.slots)
    available_slots = sum(slot.max_bookings - len(slot.bookings) for slot in db_event.slots)

    return EventListResponse(
        id=db_event.id,
        title=db_event.title,
        description=db_event.description,
        created_at=db_event.created_at,
        total_slots=total_slots,
        available_slots=available_slots
    )

@router.get("/", response_model=List[EventListResponse])
def get_events(db: Session = Depends(get_db)):
    """Get all events with slot counts."""
    events = db.query(Event).all()
    result = []
    for event in events:
        total_slots = len(event.slots)
        available_slots = sum(slot.max_bookings - len(slot.bookings) for slot in event.slots)
        result.append(
            EventListResponse(
                id=event.id,
                title=event.title,
                description=event.description,
                created_at=event.created_at,
                total_slots=total_slots,
                available_slots=available_slots
            )
        )
    return result