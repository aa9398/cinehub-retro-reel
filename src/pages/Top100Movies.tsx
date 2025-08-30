import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieCard } from '@/components/MovieCard';
import { Trophy, Star, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  imdb_rating?: number;
  runtime_minutes?: number;
  director?: string;
  cast_members?: string[];
  awards?: string;
  country?: string;
}

const Top100Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [purchasedMovies, setPurchasedMovies] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTop100Movies();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    filterMovies();
  }, [movies, genreFilter, yearFilter]);

  const fetchTop100Movies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .not('imdb_rating', 'is', null)
        .order('imdb_rating', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching top 100 movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch watchlist
      const { data: watchlistData } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', user.id);

      // Fetch purchased movies
      const { data: purchasedData } = await supabase
        .from('purchased_movies')
        .select('movie_id')
        .eq('user_id', user.id);

      setWatchlist(watchlistData?.map(item => item.movie_id) || []);
      setPurchasedMovies(purchasedData?.map(item => item.movie_id) || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (genreFilter !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (yearFilter !== 'all') {
      const decade = parseInt(yearFilter);
      filtered = filtered.filter(movie => {
        const year = movie.release_year;
        return year >= decade && year < decade + 10;
      });
    }

    setFilteredMovies(filtered);
  };

  const genres = Array.from(new Set(movies.map(movie => movie.genre)));
  const decades = Array.from(new Set(movies.map(movie => Math.floor(movie.release_year / 10) * 10))).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-pixel text-xs text-primary animate-pixel-bounce shadow-glow">⚡ LOADING TOP 100...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ultra Hero Section */}
      <div className="text-center py-16 space-y-6 ultra-pixel-card p-12 retro-scanlines">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Trophy className="w-12 h-12 text-accent animate-pixel-pulse" />
          <h1 className="font-pixel text-3xl md:text-5xl font-bold text-primary leading-relaxed neon-glow">
            ◆ TOP 100 MOVIES ◆
          </h1>
          <Trophy className="w-12 h-12 text-accent animate-pixel-pulse" />
        </div>
        
        <div className="flex justify-center items-center gap-3 text-accent font-pixel text-sm">
          <Star className="w-5 h-5 fill-current animate-pixel-pulse" />
          <span>━━━ HIGHEST RATED FILMS ━━━</span>
          <Star className="w-5 h-5 fill-current animate-pixel-pulse" />
        </div>
        
        <p className="text-muted-foreground text-base max-w-3xl mx-auto font-medium">
          Discover the greatest movies of all time, ranked by IMDb rating. From timeless classics to modern masterpieces,
          explore cinema's finest achievements in our ultra-pixel archive.
        </p>
        
        <div className="flex justify-center items-center gap-4 mt-6">
          <div className="pixel-badge bg-primary text-primary-foreground">
            📊 {movies.length} MOVIES
          </div>
          <div className="pixel-badge bg-accent text-accent-foreground">
            ⭐ AVG: {movies.length > 0 ? (movies.reduce((sum, m) => sum + (m.imdb_rating || 0), 0) / movies.length).toFixed(1) : '0'}/10
          </div>
        </div>
      </div>

      {/* Ultra Filters */}
      <div className="ultra-pixel-card p-6 space-y-4">
        <h3 className="font-pixel text-sm text-accent neon-glow flex items-center gap-2">
          <Filter className="w-4 h-4" />
          🔍 FILTER TOP 100
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="border-2 border-border bg-input shadow-pixel hover:shadow-glow font-pixel text-xs">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="border-2 border-border bg-input shadow-pixel hover:shadow-glow font-pixel text-xs">
              <SelectValue placeholder="Filter by decade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Decades</SelectItem>
              {decades.map((decade) => (
                <SelectItem key={decade} value={decade.toString()}>
                  {decade}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 100 Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-12 ultra-pixel-card">
          <div className="font-pixel text-sm text-muted-foreground">
            ⚠ NO MOVIES FOUND IN TOP 100 ⚠
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Movies - Special Layout */}
          {filteredMovies.slice(0, 3).length > 0 && (
            <div className="ultra-pixel-card p-6 space-y-4">
              <h2 className="font-pixel text-lg text-accent neon-glow text-center">
                🏆 PODIUM CHAMPIONS 🏆
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredMovies.slice(0, 3).map((movie, index) => (
                  <div key={movie.id} className="relative">
                    <div className={`absolute -top-4 -right-4 z-10 pixel-badge text-xs ${
                      index === 0 ? 'bg-accent text-accent-foreground animate-pixel-pulse' :
                      index === 1 ? 'bg-secondary text-secondary-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : '🥉 #3'}
                    </div>
                    <MovieCard
                      movie={movie}
                      inWatchlist={watchlist.includes(movie.id)}
                      isPurchased={purchasedMovies.includes(movie.id)}
                      onWatchlistUpdate={fetchUserData}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remaining Movies - Regular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.slice(3).map((movie, index) => (
              <div key={movie.id} className="relative">
                <div className="absolute -top-2 -left-2 z-10 pixel-badge text-xs bg-muted text-muted-foreground">
                  #{index + 4}
                </div>
                <MovieCard
                  movie={movie}
                  inWatchlist={watchlist.includes(movie.id)}
                  isPurchased={purchasedMovies.includes(movie.id)}
                  onWatchlistUpdate={fetchUserData}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Top100Movies;