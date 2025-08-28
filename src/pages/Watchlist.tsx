import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieCard } from '@/components/MovieCard';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  description: string;
  release_year: number;
  genre: string;
  poster_url: string;
  trailer_link: string;
  streaming_platforms: string[];
  price: number;
  is_premium: boolean;
}

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [purchasedMovies, setPurchasedMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchWatchlistMovies();
    fetchPurchasedMovies();
  }, [user]);

  const fetchWatchlistMovies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          movie_id,
          movies (
            id,
            title,
            description,
            release_year,
            genre,
            poster_url,
            trailer_link,
            streaming_platforms,
            price,
            is_premium
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      
      const moviesData = data?.map(item => item.movies).filter(Boolean) || [];
      setMovies(moviesData as Movie[]);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedMovies = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('purchased_movies')
        .select('movie_id')
        .eq('user_id', user.id);

      setPurchasedMovies(data?.map(item => item.movie_id) || []);
    } catch (error) {
      console.error('Error fetching purchased movies:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-retro text-primary text-xl animate-pulse">LOADING WATCHLIST...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-12 w-12 text-primary mr-4 animate-neon-glow" />
          <h1 className="font-retro text-5xl font-black text-primary animate-retro-flicker">
            MY WATCHLIST
          </h1>
        </div>
        <p className="font-retro text-muted-foreground text-lg max-w-2xl mx-auto">
          Your curated collection of movies to watch later
        </p>
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <div className="font-retro text-muted-foreground text-xl mb-4">
            YOUR WATCHLIST IS EMPTY
          </div>
          <p className="text-muted-foreground">
            Add some movies to your watchlist from the catalog!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              inWatchlist={true}
              isPurchased={purchasedMovies.includes(movie.id)}
              onWatchlistUpdate={fetchWatchlistMovies}
            />
          ))}
        </div>
      )}
    </div>
  );
}