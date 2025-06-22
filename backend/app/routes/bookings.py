import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.booking import Booking, BookingCreate, BookingResponse
from app.models.event import TimeSlot

router = APIRouter(prefix="/bookings", tags=["bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """Create a booking for a time slot."""
    db_slot = db.query(TimeSlot).filter(TimeSlot.id == booking.slot_id).first()
    if not db_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
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

@router.get("/users/{email}/bookings", response_model=List[BookingResponse])
def get_user_bookings(email: str, db: Session = Depends(get_db)):
    """Get all bookings for a user by email."""
    bookings = db.query(Booking).filter(Booking.user_email == email).all()
    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings found for this user")
    
    return [
        BookingResponse(
            id=booking.id,
            slot_id=booking.slot_id,
            user_name=booking.user_name,
            user_email=booking.user_email,
            booked_at=booking.booked_at
        )
        for booking in bookings
    ]

@router.get("/all", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    """Get all bookings (for debugging)."""
    bookings = db.query(Booking).all()
    return [
        BookingResponse(
            id=booking.id,
            slot_id=booking.slot_id,
            user_name=booking.user_name,
            user_email=booking.user_email,
            booked_at=booking.booked_at
        )
        for booking in bookings
    ]
