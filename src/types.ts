export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface Rating {
  id: number;
  tmdb_movie_id: number;
  movie_title: string;
  rating: number;
  created_at: string;
  updated_at: string;
}
