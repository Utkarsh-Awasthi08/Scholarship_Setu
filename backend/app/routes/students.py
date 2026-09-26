from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import get_current_user, require_role
from app.database import get_db
from app.models import Student, User
from app.schemas import StudentResponse


router = APIRouter(prefix="/api/students", tags=["Students"])


@router.get("/me", response_model=StudentResponse)
async def get_my_student_profile(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).filter(Student.user_id == user.id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Profile not found. Complete the chat first.")
    return student


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Student).filter(Student.id == student_id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    if student.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this profile.")
    return student
