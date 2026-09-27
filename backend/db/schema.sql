-- =============================================================
-- Sentence Builder — Database Schema
-- Target: PostgreSQL 14+
-- =============================================================

-- Drop in reverse dependency order for idempotent re-runs
DROP TABLE IF EXISTS sentence_words CASCADE;
DROP TABLE IF EXISTS sentences CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS word_types CASCADE;

-- -------------------------------------------------------------
-- word_types
-- The nine grammatical categories users can choose from.
-- -------------------------------------------------------------
CREATE TABLE word_types (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
);

-- -------------------------------------------------------------
-- words
-- A word belongs to exactly one word_type.
-- -------------------------------------------------------------
CREATE TABLE words (
  id        SERIAL PRIMARY KEY,
  type_id   INTEGER NOT NULL REFERENCES word_types(id) ON DELETE CASCADE,
  value     VARCHAR(100) NOT NULL
);

CREATE INDEX idx_words_type_id ON words(type_id);

-- -------------------------------------------------------------
-- sentences
-- A sentence is the assembled text the user saves.
-- -------------------------------------------------------------
CREATE TABLE sentences (
  id          SERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sentences_updated_at ON sentences(updated_at DESC);

-- -------------------------------------------------------------
-- sentence_words
-- Preserves the exact words (with order) that built a sentence.
-- This is optional but enables reconstruction/editing by word.
-- -------------------------------------------------------------
CREATE TABLE sentence_words (
  sentence_id  INTEGER NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  word_id      INTEGER NOT NULL REFERENCES words(id) ON DELETE RESTRICT,
  position     INTEGER NOT NULL,
  PRIMARY KEY (sentence_id, position)
);

-- -------------------------------------------------------------
-- Trigger: keep sentences.updated_at in sync on UPDATE
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sentences_updated_at
BEFORE UPDATE ON sentences
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
