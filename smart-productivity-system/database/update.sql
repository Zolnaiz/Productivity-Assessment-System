-- Incremental update: idea vote tracking table
CREATE TABLE IF NOT EXISTS idea_votes (
  idea_id INT NOT NULL REFERENCES improvement_ideas(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_idea_votes UNIQUE (idea_id, user_id)
);

-- Optional supporting index for per-user lookups
CREATE INDEX IF NOT EXISTS idx_idea_votes_user_id ON idea_votes(user_id);
