from pydantic import BaseModel

class WordBase(BaseModel):
    word: str
    meaning: str
    category: str
    difficulty: str
    editorial_example: str
    pronunciation: str
    etymology: str
    synonyms: str
    antonyms: str

class WordResponse(WordBase):
    id: int
    word: str
    meaning: str
    category: str
    difficulty: str
    editorial_example: str
    pronunciation: str
    etymology: str
    synonyms: str
    antonyms: str

    class Config:
        orm_mode = True

class AIWordRequest(BaseModel):
    word: str


class Quiz(BaseModel):
    word: str
    meaning: str
    options: list[str]
    correct_option: str