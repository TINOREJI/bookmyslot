from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.base import Base
from app.models.uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid

class Event(Base):
    """SQLAlchemy model for events."""
    __tablename__ = "events"
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    slots = relationship("TimeSlot", back_populates="event", cascade="all, delete-orphan")

class TimeSlot(Base):
    """SQLAlchemy model for time slots."""
    __tablename__ = "time_slots"
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(), ForeignKey("events.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    max_bookings = Column(Integer, nullable=False, default=1)
    event = relationship("Event", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot", cascade="all, delete-orphan")

class TimeSlotCreate(BaseModel):
    """Pydantic model for creating a time slot."""
    start_time: datetime = Field(..., example="2025-06-20T10:00:00Z")
    max_bookings: int = Field(..., ge=1, example=1)

class EventCreate(BaseModel):
    """Pydantic model for creating an event."""
    title: str = Field(..., min_length=3, max_length=100, example="Team Meeting")
    description: Optional[str] = Field(None, max_length=500, example="Weekly sync")
    slots: List[TimeSlotCreate] = Field(..., example=[{"start_time": "2025-06-20T10:00:00Z", "max_bookings": 1}])

class TimeSlotResponse(BaseModel):
    """Pydantic model for time slot response."""
    id: uuid.UUID
    start_time: datetime
    max_bookings: int
    model_config = ConfigDict(arbitrary_types_allowed=True)

class EventResponse(BaseModel):
    """Pydantic model for event response."""
    id: uuid.UUID
    title: str
    description: Optional[str]
    created_at: datetime
    slots: List[TimeSlotResponse]
    model_config = ConfigDict(arbitrary_types_allowed=True)

class EventListResponse(BaseModel):
    """Pydantic model for event list response."""
    id: uuid.UUID
    title: str
    description: Optional[str]
    created_at: datetime
    total_slots: int
    available_slots: int
    slots: List[TimeSlotResponse]  # Added to include slot details
    model_config = ConfigDict(arbitrary_types_allowed=True)