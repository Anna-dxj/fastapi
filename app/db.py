import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends
from .models import Base

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
print(f'database url {DATABASE_URL}')

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db():
    Base.metadata.create_all(bind=engine)

def get_db(db: Session = Depends(SessionLocal)):
    try: 
        yield db
    finally: 
        db.close()

def get_session_local():
    db = SessionLocal()

    try: 
        yield db
    finally: 
        db.close()