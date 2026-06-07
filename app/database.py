from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("postgresql://postgres:1234@localhost:5432/upsc_vocab", echo=True)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()
