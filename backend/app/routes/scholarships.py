from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user
from app.models import ScholarshipScheme, Student, User
from app.schemas import ScholarshipSchemeResponse
from app.chatbot_service import ChatbotService

router = APIRouter(prefix="/api/scholarships", tags=["Scholarships"])

@router.get("", response_model=List[ScholarshipSchemeResponse])
async def list_scholarships(state: Optional[str] = None, category: Optional[str] = None, gender: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(ScholarshipScheme)
    if state:
        query = query.filter(ScholarshipScheme.state == state)
    result = await db.execute(query)
    schemes = result.scalars().all()
    return schemes

@router.get("/recommend/{student_id}")
async def recommend_scholarships(
    student_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Student).options(selectinload(Student.education)).filter(Student.id == student_id, Student.user_id == user.id)
    )
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    education = student.education
    if not education:
        raise HTTPException(status_code=409, detail="Student education profile is incomplete")

    student_data = {
        "ask_state": student.state,
        "ask_income": student.family_annual_income,
        "ask_category": student.category,
        "ask_gender": student.gender,
        "ask_12th_percentage": education.percentage_12th,
        "ask_12th_board": education.board_12th,
        "ask_rural_urban": "Rural" if education.is_rural_area else "Urban",
        "ask_bpl": "Yes" if student.is_bpl else "No",
    }
    service = ChatbotService(db)
    schemes = await service.get_matching_scholarships(student_data)
    
    return [{"scheme": s["scheme"].name, "scheme_id": s["scheme"].id, "match_score": s["match_score"]} for s in schemes]


@router.get("/{id}", response_model=ScholarshipSchemeResponse)
async def get_scholarship(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScholarshipScheme).filter(ScholarshipScheme.id == id))
    scheme = result.scalars().first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scheme
