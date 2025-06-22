import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.booking import Booking, BookingCreate, BookingResponse

from app.database import SessionLocal
from app.models.event import Event, TimeSlot, EventCreate, EventResponse, EventListResponse, TimeSlotResponse
from app.models.booking import Booking

router = APIRouter(prefix="/events", tags=["events"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=EventListResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(
        title=event.title,
        description=event.description,
        created_at=datetime.utcnow()
    )
    db.add(db_event)
    db.flush()

    slots = []
    for slot in event.slots:
        db_slot = TimeSlot(
            event_id=db_event.id,
            start_time=slot.start_time,
            max_bookings=slot.max_bookings
        )
        db.add(db_slot)
        db.flush()
        slots.append(TimeSlotResponse(
            id=db_slot.id,
            start_time=db_slot.start_time,
            max_bookings=db_slot.max_bookings,
            current_bookings=0  # Initialize as 0
        ))

    db.commit()
    db.refresh(db_event)

    total_slots = len(db_event.slots)
    available_slots = sum(slot.max_bookings for slot in db_event.slots)

    return EventListResponse(
        id=db_event.id,
        title=db_event.title,
        description=db_event.description,
        created_at=db_event.created_at,
        total_slots=total_slots,
        available_slots=available_slots,
        slots=slots
    )

@router.get("/", response_model=List[EventListResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    result = []
    
    for event in events:
        slots = []
        for slot in event.slots:
            current_bookings = db.query(Booking).filter(
                Booking.slot_id == slot.id
            ).count()
            
            slots.append(TimeSlotResponse(
                id=slot.id,
                start_time=slot.start_time,
                max_bookings=slot.max_bookings,
                current_bookings=current_bookings
            ))
        
        total_slots = len(event.slots)
        available_slots = sum(slot.max_bookings - slot.current_bookings for slot in slots)
        
        result.append(EventListResponse(
            id=event.id,
            title=event.title,
            description=event.description,
            created_at=event.created_at,
            total_slots=total_slots,
            available_slots=available_slots,
            slots=slots
        ))
    return result

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    slots = []
    for slot in event.slots:
        current_bookings = db.query(Booking).filter(
            Booking.slot_id == slot.id
        ).count()
        
        slots.append(TimeSlotResponse(
            id=slot.id,
            start_time=slot.start_time,
            max_bookings=slot.max_bookings,
            current_bookings=current_bookings
        ))
    
    return EventResponse(
        id=event.id,
        title=event.title,
        description=event.description,
        created_at=event.created_at,
        slots=slots
    )

@router.post("/{event_id}/bookings", response_model=BookingResponse)
def create_booking_for_event(
    event_id: uuid.UUID,
    booking: BookingCreate,
    db: Session = Depends(get_db)
):
    db_slot = db.query(TimeSlot).filter(
        TimeSlot.id == booking.slot_id,
        TimeSlot.event_id == event_id
    ).first()
    
    if not db_slot:
        raise HTTPException(status_code=404, detail="Time slot not found in this event")
    
    current_bookings = db.query(Booking).filter(
        Booking.slot_id == booking.slot_id
    ).count()
    
    if current_bookings >= db_slot.max_bookings:
        raise HTTPException(status_code=400, detail="Time slot is fully booked")
    
    existing_booking = db.query(Booking).filter(
        Booking.slot_id == booking.slot_id,
        Booking.user_email == booking.user_email
    ).first()
    
    if existing_booking:
        raise HTTPException(status_code=400, detail="User already booked this slot")
    
    db_booking = Booking(
        slot_id=booking.slot_id,
        user_name=booking.user_name,
        user_email=booking.user_email,
        booked_at=func.now()
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return BookingResponse(
        id=db_booking.id,
        slot_id=db_booking.slot_id,
        user_name=db_booking.user_name,
        user_email=db_booking.user_email,
        booked_at=db_booking.booked_at
    )
