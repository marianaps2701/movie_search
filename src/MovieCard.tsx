import { Movie } from './types';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {movie.poster_path ? (
        <img
          src={`${POSTER_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-72 object-cover"
        />
      ) : (
        <div className="w-full h-72 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-gray-600">{movie.release_date?.split('-')[0] || 'N/A'}</p>
      </div>
    </div>
  );
}
