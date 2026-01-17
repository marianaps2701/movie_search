import { Movie, Rating } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search movies');
  const data = await response.json();
  return data.results || [];
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(`${API_BASE_URL}/movie/${movieId}`);
  if (!response.ok) throw new Error('Failed to get movie details');
  return response.json();
};

export const getRatings = async (): Promise<Rating[]> => {
  const response = await fetch(`${API_BASE_URL}/ratings`);
  if (!response.ok) throw new Error('Failed to get ratings');
  return response.json();
};

export const getRating = async (movieId: number): Promise<Rating | null> => {
  const response = await fetch(`${API_BASE_URL}/ratings/${movieId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to get rating');
  return response.json();
};

export const saveRating = async (
  tmdbMovieId: number,
  movieTitle: string,
  rating: number
): Promise<Rating> => {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tmdb_movie_id: tmdbMovieId,
      movie_title: movieTitle,
      rating,
    }),
  });
  if (!response.ok) throw new Error('Failed to save rating');
  return response.json();
};

export const deleteRating = async (movieId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/ratings/${movieId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete rating');
};
