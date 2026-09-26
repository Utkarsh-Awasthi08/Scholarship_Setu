from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy.future import select

from app.database import apply_compatibility_migrations, engine, Base
from app.routes import admin, applications, auth, chat, documents, scholarships, students
from app.auth import _jwt_secret, hash_password
from app.models import User
from app.scholarship_data import seed_scholarships

app = FastAPI(title="ScholarSetu API", description="AI-powered scholarship chatbot backend")

cors_origins = [origin.strip() for origin in os.getenv(
    "CORS_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173"
).split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    _jwt_secret()

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await apply_compatibility_migrations()
    
    # Seed data
    from app.database import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        await seed_scholarships(session)
        admin_email = os.getenv("INITIAL_ADMIN_EMAIL", "").strip().lower()
        admin_password = os.getenv("INITIAL_ADMIN_PASSWORD", "")
        if admin_email and admin_password:
            existing = await session.execute(select(User).filter(User.email == admin_email))
            if not existing.scalars().first():
                session.add(User(email=admin_email, password_hash=hash_password(admin_password), role="admin"))
                await session.commit()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(scholarships.router)
app.include_router(documents.router)
app.include_router(students.router)
app.include_router(admin.router)
