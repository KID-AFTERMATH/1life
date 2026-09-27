-- =============================================================
-- Sentence Builder — Seed Data
-- Populates the nine required word types and sample words.
-- =============================================================

-- -------------------------------------------------------------
-- Word types (fixed order matches the assessment)
-- -------------------------------------------------------------
INSERT INTO word_types (name) VALUES
  ('Noun'),
  ('Verb'),
  ('Adjective'),
  ('Adverb'),
  ('Pronoun'),
  ('Preposition'),
  ('Conjunction'),
  ('Determiner'),
  ('Exclamation');

-- -------------------------------------------------------------
-- Sample words per type (10 each)
-- The SELECT pulls the correct type_id by name at insert time.
-- -------------------------------------------------------------

-- Nouns
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('dog'), ('cat'), ('house'), ('river'), ('child'),
  ('teacher'), ('city'), ('book'), ('mountain'), ('friend')
) AS v(value)
WHERE wt.name = 'Noun';

-- Verbs
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('runs'), ('jumps'), ('sings'), ('writes'), ('reads'),
  ('eats'), ('sleeps'), ('thinks'), ('plays'), ('builds')
) AS v(value)
WHERE wt.name = 'Verb';

-- Adjectives
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('happy'), ('quick'), ('bright'), ('tall'), ('loud'),
  ('quiet'), ('gentle'), ('fierce'), ('ancient'), ('modern')
) AS v(value)
WHERE wt.name = 'Adjective';

-- Adverbs
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('quickly'), ('slowly'), ('loudly'), ('quietly'), ('happily'),
  ('sadly'), ('boldly'), ('carefully'), ('often'), ('never')
) AS v(value)
WHERE wt.name = 'Adverb';

-- Pronouns
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('I'), ('you'), ('he'), ('she'), ('it'),
  ('we'), ('they'), ('them'), ('us'), ('me')
) AS v(value)
WHERE wt.name = 'Pronoun';

-- Prepositions
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('in'), ('on'), ('at'), ('under'), ('over'),
  ('with'), ('without'), ('between'), ('through'), ('across')
) AS v(value)
WHERE wt.name = 'Preposition';

-- Conjunctions
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('and'), ('but'), ('or'), ('nor'), ('for'),
  ('yet'), ('so'), ('because'), ('although'), ('while')
) AS v(value)
WHERE wt.name = 'Conjunction';

-- Determiners
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('the'), ('a'), ('an'), ('this'), ('that'),
  ('these'), ('those'), ('my'), ('your'), ('their')
) AS v(value)
WHERE wt.name = 'Determiner';

-- Exclamations
INSERT INTO words (type_id, value)
SELECT wt.id, v.value
FROM word_types wt
CROSS JOIN (VALUES
  ('wow'), ('oh'), ('hey'), ('alas'), ('hurray'),
  ('ouch'), ('hmm'), ('yay'), ('oops'), ('bravo')
) AS v(value)
WHERE wt.name = 'Exclamation';
