from pydantic import BaseModel

class WordBase(BaseModel):
    word: str
    meaning: str
    category: str
    difficulty: str
    editorial_example: str

class WordResponse(WordBase):
    id: int
    word: str
    meaning: str
    category: str
    difficulty: str
    editorial_example: str

    class Config:
        orm_mode = True
