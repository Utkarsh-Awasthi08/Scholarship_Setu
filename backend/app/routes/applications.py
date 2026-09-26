from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.auth import get_current_user
from app.database import get_db
from app.models import Application, ScholarshipScheme, Student, User


router = APIRouter(prefix="/api/applications", tags=["Applications"])


async def get_current_student(user: User, db: AsyncSession) -> Student:
    result = await db.execute(select(Student).filter(Student.user_id == user.id))
    student = result.scalars().first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complete your profile before managing applications.")
    return student


def serialize_application(application: Application) -> dict:
    return {
        "id": application.id,
        "scheme_id": application.scheme_id,
        "scheme": application.scheme.name if application.scheme else "Scholarship",
        "scheme_short_name": application.scheme.short_name if application.scheme else "",
        "status": application.status,
        "match_score": application.match_score,
        "applied_at": application.applied_at.isoformat() if application.applied_at else None,
        "updated_at": application.updated_at.isoformat() if application.updated_at else None,
        "rejection_reason": application.rejection_reason,
    }


@router.get("/me")
async def list_my_applications(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    student = await get_current_student(user, db)
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.scheme))
        .filter(Application.student_id == student.id)
        .order_by(Application.updated_at.desc())
    )
    return {"student_name": student.full_name, "applications": [serialize_application(app) for app in result.scalars().all()]}


@router.post("/{scheme_id}/submit")
async def submit_application(scheme_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    student = await get_current_student(user, db)
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.scheme))
        .filter(Application.student_id == student.id, Application.scheme_id == scheme_id)
    )
    application = result.scalars().first()
    if not application:
        scheme_result = await db.execute(select(ScholarshipScheme).filter(ScholarshipScheme.id == scheme_id, ScholarshipScheme.is_active == True))
        scheme = scheme_result.scalars().first()
        if not scheme:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scholarship not found.")
        application = Application(student_id=student.id, scheme_id=scheme.id, status="submitted", match_score=0)
        db.add(application)
        await db.flush()
    elif application.status == "recommended":
        application.status = "submitted"
    elif application.status in {"approved", "rejected", "disbursed"}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This application can no longer be submitted again.")

    await db.commit()
    result = await db.execute(select(Application).options(selectinload(Application.scheme)).filter(Application.id == application.id))
    return serialize_application(result.scalars().first())
