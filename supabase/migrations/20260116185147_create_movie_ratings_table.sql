/*
  # Create movie ratings table

  1. New Tables
    - `movie_ratings`
      - `id` (integer, primary key, auto-increment)
      - `tmdb_movie_id` (integer, unique) - The TMDB movie ID
      - `movie_title` (text) - Movie title for quick display
      - `rating` (integer) - User rating from 1 to 5
      - `created_at` (timestamp) - When the rating was created
      - `updated_at` (timestamp) - When the rating was last updated

  2. Security
    - Enable RLS on `movie_ratings` table
    - Add policy for public access (no auth required per requirements)
*/

CREATE TABLE IF NOT EXISTS movie_ratings (
  id SERIAL PRIMARY KEY,
  tmdb_movie_id INTEGER UNIQUE NOT NULL,
  movie_title TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE movie_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON movie_ratings FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON movie_ratings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON movie_ratings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON movie_ratings FOR DELETE
  USING (true);