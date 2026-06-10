from app.database import Base, engine
from sqlalchemy import Column, Integer, String


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, unique=True, index=True)
    meaning = Column(String)
    category = Column(String)
    difficulty = Column(String)
    editorial_example = Column(String)
    pronunciation = Column(String)
    etymology = Column(String)
    synonyms = Column(String)
    antonyms = Column(String)


