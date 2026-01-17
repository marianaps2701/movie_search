import { useEffect, useState } from 'react';
import { X, Star } from 'lucide-react';
import { Movie } from './types';
import { getMovieDetails, getRating, saveRating, deleteRating } from './api';

interface MovieDetailsProps {
  movieId: number;
  onClose: () => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetails({ movieId, onClose }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadMovieData();
  }, [movieId]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const [movieData, ratingData] = await Promise.all([
        getMovieDetails(movieId),
        getRating(movieId),
      ]);
      setMovie(movieData);
      setCurrentRating(ratingData?.rating || 0);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!movie) return;
    try {
      if (rating === currentRating) {
        await deleteRating(movieId);
        setCurrentRating(0);
      } else {
        await saveRating(movieId, movie.title, rating);
        setCurrentRating(rating);
      }
    } catch (err) {
      setError('Failed to save rating');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-red-600">{error || 'Movie not found'}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>

          {movie.poster_path && (
            <img
              src={`${POSTER_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
            <p className="text-gray-600 mb-4">
              Released: {movie.release_date || 'N/A'}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700">{movie.overview || 'No synopsis available'}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Your Rating</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className="w-10 h-10"
                      fill={
                        rating <= (hoverRating || currentRating)
                          ? '#fbbf24'
                          : 'none'
                      }
                      stroke={
                        rating <= (hoverRating || currentRating)
                          ? '#fbbf24'
                          : '#d1d5db'
                      }
                    />
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Click the same star to remove your rating
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
