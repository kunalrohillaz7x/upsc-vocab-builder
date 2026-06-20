from app.database import Base, engine
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


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
    saved_words = relationship(
    "SavedWord",
    back_populates="word"
)

class SavedWord(Base):
    __tablename__ = "saved_words"

    id = Column(Integer, primary_key=True, index=True)

    word_id = Column(
        Integer,
        ForeignKey("words.id"),
        nullable=False
    )
    word = relationship(
    "Word",
    back_populates="saved_words"
)


