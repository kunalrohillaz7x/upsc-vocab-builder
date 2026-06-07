

from fastapi import FastAPI,APIRouter,Depends
from app.models import Word
from app.models import Word
from app.database import SessionLocal, engine ,get_db
from app.schemas import WordBase
from sqlalchemy.orm import Session


app = FastAPI()
router = APIRouter()

session = SessionLocal()

@router.get("/words")
def get_words(db: Session = Depends(get_db)):
    words = db.query(Word).all()
    return [{
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    } for word in words]

@router.post("/words")
def add_word(word: WordBase, db: Session = Depends(get_db)):
    new_word = Word(
        word=word.word,
        meaning=word.meaning,
        category=word.category,
        difficulty=word.difficulty,
        editorial_example=word.editorial_example
    )
    db.add(new_word)
    db.commit()
    return {"message": "Word added successfully"}


@router.get("/words/{id}")
def get_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        return {"message": "Word not found"}
    return {
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    }

@router.delete("/words/{id}")
def delete_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        return {"message": "Word not found"}
    db.delete(word)
    db.commit()
    return {"message": "Word deleted successfully"}
