from app.database import engine, Base, SessionLocal
from app.models import Word
from app.schemas import WordBase
from fastapi import FastAPI
Base.metadata.create_all(bind=engine)
session = SessionLocal()

# new_word = Word(
#     word="example",
#     meaning="a thing characteristic of its kind or illustrating a general rule.",
#     category="noun",
#     difficulty="easy",
#     editorial_example="This is an example of how to use the word in a sentence."
# )
# session.add(new_word)
# session.commit()

# words = session.query(Word).all()
# for word in words:
#     print(f"Word: {word.word}, Meaning: {word.meaning}, Category: {word.category}, Difficulty: {word.difficulty}, Editorial Example: {word.editorial_example}")

app = FastAPI()

@app.get("/words")
def get_words():
    words = session.query(Word).all()
    return [{
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    } for word in words]

@app.post("/words")
def add_word(word: WordBase):
    new_word = Word(
        word=word.word,
        meaning=word.meaning,
        category=word.category,
        difficulty=word.difficulty,
        editorial_example=word.editorial_example
    )
    session.add(new_word)
    session.commit()
    return {"message": "Word added successfully"}


@app.get("/words/{id}")
def get_word(id: int):
    word = session.query(Word).filter(Word.id == id).first()
    if not word:
        return {"message": "Word not found"}
    return {
        "word": word.word,
        "meaning": word.meaning,
        "category": word.category,
        "difficulty": word.difficulty,
        "editorial_example": word.editorial_example
    }

@app.delete("/words/{id}")
def delete_word(id: int):
    word = session.query(Word).filter(Word.id == id).first()
    if not word:
        return {"message": "Word not found"}
    session.delete(word)
    session.commit()
    return {"message": "Word deleted successfully"}

# print("Tables created successfully")