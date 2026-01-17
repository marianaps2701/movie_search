import { useState } from 'react';
import { Search } from 'lucide-react';
import { Movie } from './types';
import { searchMovies } from './api';
import MovieCard from './MovieCard';
import MovieDetails from './MovieDetails';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      console.error(err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Movie Search & Rating
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {loading && (
          <div className="text-center text-gray-600">Loading...</div>
        )}

        {!loading && movies.length === 0 && query && (
          <div className="text-center text-gray-600">
            No movies found. Try a different search.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovieId(movie.id)}
            />
          ))}
        </div>
      </div>

      {selectedMovieId && (
        <MovieDetails
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
}

export default App;
