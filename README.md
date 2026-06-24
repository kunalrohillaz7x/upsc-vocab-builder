# UPSC Vocabulary Builder

An AI-powered vocabulary learning platform designed for UPSC aspirants. The application helps users discover, understand, revise, and practice important vocabulary commonly found in editorials, governance discussions, and competitive examination preparation.

## Live Demo

**Frontend:** https://upsc-vocab-builder.vercel.app/

**Backend API:** https://upsc-vocab-builder.onrender.com

**API Documentation:** https://upsc-vocab-builder.onrender.com/docs

---

## Features

### Vocabulary Management

* Add new vocabulary words
* Search words by keyword
* View detailed word information
* Categorize words by subject/domain

### Daily Learning

* Daily vocabulary section
* Random word generation for consistent practice

### Quiz System

* Generate vocabulary quizzes
* Multiple-choice questions
* Randomized options

### AI-Powered Word Generation

* Generate detailed vocabulary entries using Gemini AI
* Automatically generate:

  * Meaning
  * Pronunciation
  * Etymology
  * Synonyms
  * Antonyms
  * Editorial usage examples

### Saved Words

* Save important words for later revision
* View saved vocabulary collection
* Remove saved words

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* FastAPI
* Pydantic

### Database

* PostgreSQL
* Neon Database

### ORM

* SQLAlchemy

### AI Integration

* Google Gemini API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

## System Architecture

React Frontend (Vercel)

↓

FastAPI Backend (Render)

↓

PostgreSQL Database (Neon)

↓

Google Gemini API

---

## API Endpoints

### Words

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | /words        | Get all words  |
| POST   | /words        | Add a new word |
| GET    | /words/{id}   | Get word by ID |
| DELETE | /words/{id}   | Delete a word  |
| GET    | /words/search | Search words   |

### Daily Vocabulary

| Method | Endpoint    |
| ------ | ----------- |
| GET    | /daily-word |

### Quiz

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /quiz/random |

### Saved Words

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /saved-words/{word_id} |
| GET    | /saved-words           |
| DELETE | /saved-words/{word_id} |

### AI Word Generator

| Method | Endpoint |
| ------ | -------- |
| POST   | /ai-word |

---

## Local Setup

### Backend

```bash
git clone <repository-url>

cd upsc-vocab-builder

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend/client

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
```

---

## Future Improvements (Version 2)

* User Authentication
* Personalized Vocabulary Lists
* Progress Tracking
* Spaced Repetition System
* Word Revision Analytics
* User-specific Saved Words
* Advanced Quiz Modes

---

## Author

Kunal Rohilla

B.Tech CSE | IIIT Sonepat

Focused on Backend Development, Databases, and System Design.
