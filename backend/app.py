import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv('TMDB_API_KEY', '')
# TMDB_API_KEY = "8abd0b3505eae85fdd0fff999e4e3998"

print("TMDB_API_KEY:", TMDB_API_KEY)
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# =========================
# SUPABASE (comentado)
# =========================
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

# =========================
# TMDB ROUTES
# =========================

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        response = requests.get(
            f'{TMDB_BASE_URL}/search/movie',
            params={
                'api_key': TMDB_API_KEY,
                'query': query
            }
        )
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/movie/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    try:
        response = requests.get(
            f'{TMDB_BASE_URL}/movie/{movie_id}',
            params={'api_key': TMDB_API_KEY}
        )
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# RATINGS ROUTES (comentadas)
# =========================

@app.route('/api/ratings', methods=['GET'])
def get_ratings():
    try:
        result = supabase.table('movie_ratings').select('*').execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ratings/<int:movie_id>', methods=['GET'])
def get_rating(movie_id):
    try:
        result = (
            supabase.table('movie_ratings')
            .select('*')
            .eq('tmdb_movie_id', movie_id)
            .limit(1)
            .execute()
        )

        if result.data and len(result.data) > 0:
            return jsonify(result.data[0]), 200

        return jsonify(None), 200

    except Exception as e:
        print("Supabase error:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/ratings', methods=['POST'])
def create_rating():
    data = request.json
    tmdb_movie_id = data.get('tmdb_movie_id')
    movie_title = data.get('movie_title')
    rating = data.get('rating')

    if not all([tmdb_movie_id, movie_title, rating]):
        return jsonify({'error': 'Missing required fields'}), 400

    if rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    try:
        result = supabase.table('movie_ratings').upsert({
            'tmdb_movie_id': tmdb_movie_id,
            'movie_title': movie_title,
            'rating': rating,
            'updated_at': 'now()'
        }).execute()
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ratings/<int:movie_id>', methods=['DELETE'])
def delete_rating(movie_id):
    try:
        supabase.table('movie_ratings').delete().eq('tmdb_movie_id', movie_id).execute()
        return jsonify({'message': 'Rating deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =========================
# APP START
# =========================

if __name__ == '__main__':
    app.run(debug=True, port=5000)
