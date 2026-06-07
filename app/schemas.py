from pydantic import BaseModel

class WordBase(BaseModel):
    word: str
    meaning: str
    category: str
    difficulty: str
    editorial_example: str