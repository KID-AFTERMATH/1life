-- Insert the nine required grammatical types
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

-- Insert sample words using a helper pattern:
-- we look up the type by name so we don't rely on hardcoded IDs.

-- Nouns
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('dog'), ('cat'), ('house'), ('river'), ('child'), ('teacher'), ('city'), ('book'), ('mountain'), ('friend')
) AS v(value) WHERE name = 'Noun';

-- Verbs
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('runs'), ('jumps'), ('sings'), ('writes'), ('reads'), ('eats'), ('sleeps'), ('thinks'), ('plays'), ('builds')
) AS v(value) WHERE name = 'Verb';

-- Adjectives
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('happy'), ('quick'), ('bright'), ('tall'), ('loud'), ('quiet'), ('gentle'), ('fierce'), ('ancient'), ('modern')
) AS v(value) WHERE name = 'Adjective';

-- Adverbs
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('quickly'), ('slowly'), ('loudly'), ('quietly'), ('happily'), ('sadly'), ('boldly'), ('carefully'), ('often'), ('never')
) AS v(value) WHERE name = 'Adverb';

-- Pronouns
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('I'), ('you'), ('he'), ('she'), ('it'), ('we'), ('they'), ('them'), ('us'), ('me')
) AS v(value) WHERE name = 'Pronoun';

-- Prepositions
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('in'), ('on'), ('at'), ('under'), ('over'), ('with'), ('without'), ('between'), ('through'), ('across')
) AS v(value) WHERE name = 'Preposition';

-- Conjunctions
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('and'), ('but'), ('or'), ('nor'), ('for'), ('yet'), ('so'), ('because'), ('although'), ('while')
) AS v(value) WHERE name = 'Conjunction';

-- Determiners
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('the'), ('a'), ('an'), ('this'), ('that'), ('these'), ('those'), ('my'), ('your'), ('their')
) AS v(value) WHERE name = 'Determiner';

-- Exclamations
INSERT INTO words (type_id, value)
SELECT id, value FROM word_types, (VALUES
  ('wow'), ('oh'), ('hey'), ('alas'), ('hurray'), ('ouch'), ('hmm'), ('yay'), ('oops'), ('bravo')
) AS v(value) WHERE name = 'Exclamation';