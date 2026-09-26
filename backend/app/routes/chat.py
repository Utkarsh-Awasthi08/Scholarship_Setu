import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import get_current_user
from app.chatbot_service import ChatbotService
from app.database import get_db
from app.models import ChatSession, User


router = APIRouter(prefix="/api/chat", tags=["Chat"])


async def get_owned_session(session_id: str, user: User, db: AsyncSession) -> ChatSession:
    result = await db.execute(select(ChatSession).filter(ChatSession.id == session_id))
    session = result.scalars().first()
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return session


def response_payload(response):
    return {
        "session_id": response.session_id,
        "message": response.message,
        "next_step": response.next_step,
        "is_complete": response.is_complete,
        "options": response.options,
        "requires_file": response.requires_file,
        "collected_data": response.collected_data,
        "scholarships": response.scholarships,
        "ocr_result": response.ocr_result,
        "progress": response.progress,
    }


@router.post("/start")
async def start_chat(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session_id = str(uuid.uuid4())
    service = ChatbotService(db, user)
    response = await service.process_message(session_id, "")
    return response_payload(response)


@router.post("/message/{session_id}")
async def send_message(
    session_id: str,
    message: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await get_owned_session(session_id, user, db)
    service = ChatbotService(db, user)
    response = await service.process_message(session_id, message or "uploaded", file)
    return response_payload(response)


@router.get("/session/{session_id}")
async def get_session(session_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = await get_owned_session(session_id, user, db)
    return {
        "id": session.id,
        "current_step": session.current_step,
        "collected_data": session.collected_data,
        "created_at": str(session.created_at),
        "updated_at": str(session.updated_at),
    }


@router.post("/session/{session_id}/reset")
async def reset_session(session_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = await get_owned_session(session_id, user, db)
    session.current_step = "welcome"
    session.session_data = {}
    session.collected_data = {"achievements": [], "document_records": []}
    await db.commit()

    service = ChatbotService(db, user)
    response = await service.process_message(session_id, "")
    return response_payload(response)
