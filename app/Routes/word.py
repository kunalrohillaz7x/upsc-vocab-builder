

from fastapi import FastAPI,APIRouter,Depends,HTTPException
from app.models import Word
from app.database import get_db
from app.schemas import WordBase, WordResponse
from sqlalchemy.orm import Session
from sqlalchemy import func


router = APIRouter()


@router.get("/words", response_model=list[WordResponse])
def get_words(db: Session = Depends(get_db)):
    words = db.query(Word).all()
    return words

@router.post("/words", response_model=WordResponse)
def add_word(word: WordBase, db: Session = Depends(get_db)):
    new_word = Word(
        word=word.word,
        meaning=word.meaning,
        category=word.category,
        difficulty=word.difficulty,
        editorial_example=word.editorial_example,
        pronunciation=word.pronunciation,
        etymology=word.etymology,
        synonyms=word.synonyms,
        antonyms=word.antonyms
    )
    db.add(new_word)
    db.commit()
    db.refresh(new_word)
    return new_word

@router.get("/words/search", response_model=list[WordResponse])
def search_word(keyword: str, db: Session = Depends(get_db)):
    words = db.query(Word).filter(Word.word.ilike(f"%{keyword}%")).all()
    return words


@router.get("/words/{id}", response_model=WordResponse)
def get_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word
    

@router.post("/words/bulk", response_model=list[WordResponse])
def add_words(words: list[WordBase], db: Session = Depends(get_db)):
    new_words = [
        Word(
            word=word.word,
            meaning=word.meaning,
            category=word.category,
            difficulty=word.difficulty,
            editorial_example=word.editorial_example,
            pronunciation=word.pronunciation,
            etymology=word.etymology,
            synonyms=word.synonyms,
            antonyms=word.antonyms
        )
        for word in words
    ]
    db.add_all(new_words)
    db.commit()
    return new_words

@router.delete("/words/{id}")
def delete_word(id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"message": "Word deleted successfully"}

@router.get("/daily-word", response_model=list[WordResponse])
def get_daily_word(db: Session = Depends(get_db)):
    words = db.query(Word).order_by(func.random()).limit(4).all()

    if not words:
        raise HTTPException(status_code=404, detail="No words available")

    return words

@router.get("/words/category/{category}", response_model=list[WordResponse])
def get_words_by_category(category: str, db: Session = Depends(get_db)):
    words = db.query(Word).filter(Word.category == category).all()
    return words


@router.put("/words/{id}", response_model=WordResponse)
def update_word(id: int, word: WordBase, db: Session = Depends(get_db)):
    existing_word = db.query(Word).filter(Word.id == id).first()
    if not existing_word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    existing_word.word = word.word
    existing_word.meaning = word.meaning
    existing_word.category = word.category
    existing_word.difficulty = word.difficulty
    existing_word.editorial_example = word.editorial_example
    existing_word.pronunciation = word.pronunciation
    existing_word.etymology = word.etymology
    existing_word.synonyms = word.synonyms
    existing_word.antonyms = word.antonyms

    db.commit()
    db.refresh(existing_word)
    return existing_word