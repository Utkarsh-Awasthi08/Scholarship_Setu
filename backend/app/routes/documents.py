from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import get_current_user
from app.database import get_db
from app.models import Document, Student, User


router = APIRouter(prefix="/api/documents", tags=["Documents"])


async def get_owned_document(document_id: str, user: User, db: AsyncSession) -> Document:
    result = await db.execute(
        select(Document).join(Student).filter(Document.id == document_id, Student.user_id == user.id)
    )
    document = result.scalars().first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")
    return document


@router.get("/{document_id}/status")
async def get_document_status(
    document_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    document = await get_owned_document(document_id, user, db)
    return {
        "id": document.id,
        "doc_type": document.doc_type,
        "ocr_status": document.ocr_status,
        "ocr_confidence": document.ocr_confidence,
        "is_verified": document.is_verified,
        "verification_notes": document.verification_notes,
    }


@router.post("/{document_id}/manual-review")
async def request_manual_review(
    document_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    document = await get_owned_document(document_id, user, db)
    document.ocr_status = "manual_review"
    await db.commit()
    return {"message": "Document sent for manual review."}
