import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [purchasedMovies, setPurchasedMovies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMovies();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, genreFilter]);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('release_year', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
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

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genreFilter !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    setFilteredMovies(filtered);
  };

  const genres = Array.from(new Set(movies.map(movie => movie.genre)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-pixel text-xs text-primary animate-pixel-bounce">LOADING CATALOG...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 space-y-4">
        <h1 className="font-pixel text-2xl md:text-4xl font-bold text-primary leading-relaxed">
          CINEHUB
        </h1>
        <div className="w-16 h-1 bg-primary mx-auto" />
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Discover the best films from around the world. Watch trailers, add to watchlist, 
          and rent premium content in the classic retro style.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border bg-background shadow-subtle"
          />
        </div>
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="md:w-48 border-border bg-background shadow-subtle">
            <Filter className="h-4 w-4 mr-2" />
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
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <div className="font-pixel text-xs text-muted-foreground">
            NO MOVIES FOUND
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              inWatchlist={watchlist.includes(movie.id)}
              isPurchased={purchasedMovies.includes(movie.id)}
              onWatchlistUpdate={fetchUserData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
