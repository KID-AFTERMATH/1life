-- Drop tables if they exist so we can re-run this script cleanly
DROP TABLE IF EXISTS sentence_words CASCADE;
DROP TABLE IF EXISTS sentences CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS word_types CASCADE;

-- A "word type" is a grammatical category like Noun, Verb, etc.
CREATE TABLE word_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- A "word" belongs to exactly one word type.
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  type_id INT NOT NULL REFERENCES word_types(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL
);

-- A saved sentence. We store the assembled text for simplicity.
CREATE TABLE sentences (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: which words (and in what order) made up a sentence.
-- This supports richer editing later.
CREATE TABLE sentence_words (
  sentence_id INT NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  word_id INT NOT NULL REFERENCES words(id),
  position INT NOT NULL,
  PRIMARY KEY (sentence_id, position)
);