from fastapi import FastAPI
from app.Routes.word import router

app = FastAPI()

app.include_router(router)
