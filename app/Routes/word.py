

from fastapi import FastAPI,APIRouter,Depends,HTTPException
from app.models import Word
from app.models import Word
from app.database import SessionLocal, engine ,get_db
from app.schemas import WordBase
from sqlalchemy.orm import Session
from sqlalchemy import func


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

@router.get("/words/search")
def search_word(keyword: str, db: Session = Depends(get_db)):
    words = db.query(Word).filter(Word.word.ilike(f"%{keyword}%")).all()
    return [{
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    } for word in words]


@router.get("/words/{id}")
def get_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return {
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    }

@router.post("/words/bulk")
def add_words(words: list[WordBase], db: Session = Depends(get_db)):
    new_words = [
        Word(
            word=word.word,
            meaning=word.meaning,
            category=word.category,
            difficulty=word.difficulty,
            editorial_example=word.editorial_example
        )
        for word in words
    ]
    db.add_all(new_words)
    db.commit()
    return {"message": "Words added successfully"}

@router.delete("/words/{id}")
def delete_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"message": "Word deleted successfully"}

@router.get("/daily-word")
def get_daily_word(db: Session = Depends(get_db)):
    words = db.query(Word).order_by(func.random()).limit(4).all()

    if not words:
        raise HTTPException(status_code=404, detail="No words available")

    return [{
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    } for word in words]

@router.get("/words/category/{category}")
def get_words_by_category(category: str, db: Session = Depends(get_db)):
    words = db.query(Word).filter(Word.category == category).all()
    return [{
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    } for word in words]


@router.put("/words/{id}")
def update_word(id: int, word: WordBase, db: Session = Depends(get_db)):
    existing_word = db.query(Word).filter(Word.id == id).first()
    if not existing_word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    existing_word.word = word.word
    existing_word.meaning = word.meaning
    existing_word.category = word.category
    existing_word.difficulty = word.difficulty
    existing_word.editorial_example = word.editorial_example
    
    db.commit()
    return {"message": "Word updated successfully"}