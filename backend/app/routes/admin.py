from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.auth import require_role
from app.database import get_db
from app.models import Application, Document, Student, User


router = APIRouter(prefix="/api/admin", tags=["Admin"])


class ApplicationStatusUpdate(BaseModel):
    status: Literal["submitted", "under_review", "approved", "rejected", "disbursed"]
    rejection_reason: Optional[str] = None


class DocumentVerification(BaseModel):
    notes: Optional[str] = None


def serialize_document(document: Document) -> dict:
    return {
        "id": document.id,
        "doc_type": document.doc_type,
        "ocr_status": document.ocr_status,
        "ocr_confidence": document.ocr_confidence,
        "is_verified": document.is_verified,
        "verification_notes": document.verification_notes,
        "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None,
    }


def serialize_application(application: Application) -> dict:
    return {
        "id": application.id,
        "student_id": application.student_id,
        "student_name": application.student.full_name,
        "student_email": application.student.email,
        "scheme_name": application.scheme.name,
        "status": application.status,
        "match_score": application.match_score,
        "applied_at": application.applied_at.isoformat() if application.applied_at else None,
        "updated_at": application.updated_at.isoformat() if application.updated_at else None,
        "rejection_reason": application.rejection_reason,
        "documents": [serialize_document(document) for document in application.student.documents],
    }


@router.get("/applications")
async def get_all_applications(
    _admin: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(
            selectinload(Application.scheme),
            selectinload(Application.student).selectinload(Student.documents),
        )
        .order_by(Application.updated_at.desc())
    )
    return {"applications": [serialize_application(application) for application in result.scalars().all()]}


@router.post("/documents/{document_id}/verify")
async def verify_document(
    document_id: str,
    request: DocumentVerification,
    _admin: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Document).filter(Document.id == document_id))
    document = result.scalars().first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")

    document.is_verified = True
    document.ocr_status = "verified"
    document.verification_method = "manual_admin"
    document.verification_notes = request.notes
    await db.commit()
    return serialize_document(document)


@router.patch("/applications/{application_id}")
async def update_application_status(
    application_id: str,
    request: ApplicationStatusUpdate,
    _admin: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application)
        .options(selectinload(Application.scheme), selectinload(Application.student).selectinload(Student.documents))
        .filter(Application.id == application_id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    application.status = request.status
    application.rejection_reason = request.rejection_reason if request.status == "rejected" else None
    await db.commit()
    await db.refresh(application)
    return serialize_application(application)
