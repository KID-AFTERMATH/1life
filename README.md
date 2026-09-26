# Sentence Builder

A full-stack app that lets users construct sentences by choosing words by
grammatical type.

## Stack

- Frontend: Angular 18 (standalone components)
- Backend: Node.js + Express
- Database: PostgreSQL 16
- Containers: Docker / Docker Compose

## Local Development

### Prerequisites

- Node.js 20+
- Docker Desktop

### 1. Start PostgreSQL

```bash
docker compose up -d db
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: http://localhost:3000

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
```

App: http://localhost:4200

## Full Stack via Docker

```bash
docker compose up --build
```

Then open http://localhost:4200.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/word-types` | List all word types |
| GET | `/api/words?typeId={id}` | Words for a type |
| GET | `/api/sentences` | List saved sentences |
| GET | `/api/sentences/:id` | Get a sentence |
| POST | `/api/sentences` | Create a sentence |
| PUT | `/api/sentences/:id` | Update a sentence |

## Features

- Nine grammatical word types
- Click-to-add word building
- Save, list, edit sentences
- Responsive layout
- Dockerized
