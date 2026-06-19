

from fastapi import FastAPI,APIRouter,Depends,HTTPException
from app.models import Word
from app.database import get_db
from app.schemas import QuizResponse, WordBase, WordResponse, AIWordRequest
from sqlalchemy.orm import Session
from sqlalchemy import func
from google import genai
from dotenv import load_dotenv
import os
import json
import random

load_dotenv()

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

@router.post("/ai-word", response_model=WordResponse)
def generate_word_info(
    request: AIWordRequest,
    db: Session = Depends(get_db)
):

    try:

        word = request.word.capitalize()

        existing_word = db.query(Word).filter(
            Word.word.ilike(word)
        ).first()

        if existing_word:
            raise HTTPException(
                status_code=400,
                detail="Word already exists"
            )

        client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
Explain the word {word} for a UPSC aspirant.

Return ONLY valid JSON.

Rules:
- Keep meaning under 40 words
- Keep editorial_example under 30 words
- synonyms should contain maximum 5 words
- antonyms should contain maximum 5 words
- concise and clean output only

JSON fields:
- meaning
- pronunciation
- etymology
- synonyms
- antonyms
- editorial_example
"""
        )

        raw_text = response.text

        cleaned_response = raw_text.strip()
        cleaned_response = cleaned_response.replace("```json", "")
        cleaned_response = cleaned_response.replace("```", "")

        data = json.loads(cleaned_response)

        data["synonyms"] = ", ".join(data["synonyms"])
        data["antonyms"] = ", ".join(data["antonyms"])

        new_word = Word(
            word=word,
            meaning=data["meaning"],
            pronunciation=data["pronunciation"],
            etymology=data["etymology"],
            synonyms=data["synonyms"],
            antonyms=data["antonyms"],
            editorial_example=data["editorial_example"],
            category="AI Generated",
            difficulty="Medium"
        )

        db.add(new_word)
        db.commit()
        db.refresh(new_word)

        return new_word

    except HTTPException as e:
        raise e

    except Exception as e:

        print("ERROR OCCURRED:")
        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/quiz/random",response_model=QuizResponse)
def generate_quiz(db: Session = Depends(get_db)):

    word = (
        db.query(Word)
        .order_by(func.random())
        .first()
    )

    wrong_words = (
    db.query(Word)
    .filter(Word.id != word.id)
    .order_by(func.random())
    .limit(3)
    .all()
)

    options = [word.meaning]

    for w in wrong_words:
        options.append(w.meaning)

    random.shuffle(options)

    return{
        "word": word.word,
        "question": f"What is the meaning of the word '{word.word}'?",
        "options": options,
        "correct_option": word.meaning
    }