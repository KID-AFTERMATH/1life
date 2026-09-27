# Sentence Builder

A full-stack web application that lets users construct sentences dynamically
by selecting words according to their grammatical type.

## Overview

Users can:
- Select one of nine grammatical word types (Noun, Verb, Adjective, Adverb,
  Pronoun, Preposition, Conjunction, Determiner, Exclamation).
- View a populated list of words for the selected type.
- Add words to a sentence in sequence.
- Save the completed sentence.
- View all previously saved sentences.
- Edit and update a saved sentence.

## Technology Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Angular 18 (standalone components)  |
| Backend   | Node.js 20 + Express 4              |
| Database  | PostgreSQL 16                       |
| Container | Docker + Docker Compose             |
| Deploy    | Microsoft Azure (bonus)             |

## Repository Layout

```
sentence-builder/
├── backend/          Node.js + Express API
│   ├── src/
│   ├── db/
│   ├── Dockerfile
│   └── package.json
├── frontend/         Angular 18 SPA
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start (Docker)

```bash
git clone <your-repo-url>
cd sentence-builder
docker compose up --build
```

Open http://localhost:4200

## Local Development

### Prerequisites
- Node.js 20+
- Docker Desktop
- Angular CLI (`npm install -g @angular/cli`)

### 1. Database

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at http://localhost:3000

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at http://localhost:4200

## REST API

| Method | Endpoint                     | Body                    | Description                |
|--------|------------------------------|-------------------------|----------------------------|
| GET    | `/api/word-types`            | –                       | List all word types        |
| GET    | `/api/words?typeId={id}`     | –                       | Words for the given type   |
| GET    | `/api/sentences`             | –                       | List saved sentences       |
| GET    | `/api/sentences/:id`         | –                       | Retrieve one sentence      |
| POST   | `/api/sentences`             | `{ "content": "..." }`  | Create a sentence          |
| PUT    | `/api/sentences/:id`         | `{ "content": "..." }`  | Update a sentence          |
| GET    | `/health`                    | –                       | Health check               |

## Database Schema

- `word_types(id, name)`
- `words(id, type_id, value)`
- `sentences(id, content, created_at, updated_at)`
- `sentence_words(sentence_id, word_id, position)`

## Testing the API

```bash
curl http://localhost:3000/api/word-types
curl "http://localhost:3000/api/words?typeId=1"
curl -X POST http://localhost:3000/api/sentences \
  -H "Content-Type: application/json" \
  -d '{"content":"The happy dog runs quickly."}'
curl http://localhost:3000/api/sentences
```

## Azure Deployment

See `DEPLOYMENT.md` for the full walkthrough (Container Apps + Azure
Database for PostgreSQL Flexible Server).

## License

MIT
