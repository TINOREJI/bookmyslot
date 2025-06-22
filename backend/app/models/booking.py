from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.base import Base
from app.models.uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
import uuid

class Booking(Base):
    """SQLAlchemy model for bookings."""
    __tablename__ = "bookings"
    id = Column(UUID(), primary_key=True, default=uuid.uuid4)
    slot_id = Column(UUID(), ForeignKey("time_slots.id"), nullable=False)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=False, index=True)
    booked_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    slot = relationship("TimeSlot", back_populates="bookings")
    __table_args__ = (UniqueConstraint("slot_id", "user_email", name="unique_booking"),)

class BookingCreate(BaseModel):
    """Pydantic model for creating a booking."""
    slot_id: uuid.UUID
    user_name: str = Field(..., min_length=2, max_length=100, example="John Doe")
    user_email: EmailStr = Field(..., example="john@example.com")

class BookingResponse(BaseModel):
    """Pydantic model for booking response."""
    id: uuid.UUID
    slot_id: uuid.UUID
    user_name: str
    user_email: str
    booked_at: datetime
    model_config = ConfigDict(arbitrary_types_allowed=True)