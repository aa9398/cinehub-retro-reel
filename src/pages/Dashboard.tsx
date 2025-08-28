import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovieCard } from '@/components/MovieCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { User, Heart, ShoppingBag, Film } from 'lucide-react';

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

interface UserStats {
  watchlistCount: number;
  purchasedCount: number;
  totalSpent: number;
}

export default function Dashboard() {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [purchasedMovies, setPurchasedMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState<UserStats>({ watchlistCount: 0, purchasedCount: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch watchlist movies
      const { data: watchlistData } = await supabase
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

      // Fetch purchased movies
      const { data: purchasedData } = await supabase
        .from('purchased_movies')
        .select(`
          movie_id,
          amount_paid,
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
        .order('purchased_at', { ascending: false });

      const watchlistMoviesData = watchlistData?.map(item => item.movies).filter(Boolean) || [];
      const purchasedMoviesData = purchasedData?.map(item => item.movies).filter(Boolean) || [];
      const totalSpent = purchasedData?.reduce((sum, item) => sum + (item.amount_paid || 0), 0) || 0;

      setWatchlistMovies(watchlistMoviesData as Movie[]);
      setPurchasedMovies(purchasedMoviesData as Movie[]);
      setStats({
        watchlistCount: watchlistMoviesData.length,
        purchasedCount: purchasedMoviesData.length,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchasedMovieIds = purchasedMovies.map(movie => movie.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-retro text-primary text-xl animate-pulse">LOADING DASHBOARD...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-primary mr-4 animate-neon-glow" />
          <h1 className="font-retro text-5xl font-black text-primary animate-retro-flicker">
            DASHBOARD
          </h1>
        </div>
        <p className="font-retro text-muted-foreground text-lg">
          Welcome back, {user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-retro text-sm font-medium">WATCHLIST</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-retro text-2xl font-bold text-primary">
              {stats.watchlistCount}
            </div>
            <p className="text-xs text-muted-foreground">movies saved</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-retro text-sm font-medium">OWNED</CardTitle>
            <ShoppingBag className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="font-retro text-2xl font-bold text-secondary">
              {stats.purchasedCount}
            </div>
            <p className="text-xs text-muted-foreground">movies purchased</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-retro text-sm font-medium">SPENT</CardTitle>
            <Film className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="font-retro text-2xl font-bold text-accent">
              ${stats.totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">total spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Movie Collections */}
      <Tabs defaultValue="watchlist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 font-retro bg-background/50">
          <TabsTrigger value="watchlist" className="font-retro">
            <Heart className="h-4 w-4 mr-2" />
            WATCHLIST
          </TabsTrigger>
          <TabsTrigger value="purchased" className="font-retro">
            <ShoppingBag className="h-4 w-4 mr-2" />
            OWNED MOVIES
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-6">
          {watchlistMovies.length === 0 ? (
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
              {watchlistMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  inWatchlist={true}
                  isPurchased={purchasedMovieIds.includes(movie.id)}
                  onWatchlistUpdate={fetchUserData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="space-y-6">
          {purchasedMovies.length === 0 ? (
            <div className="text-center py-12">
              <div className="font-retro text-muted-foreground text-xl mb-4">
                NO PURCHASED MOVIES
              </div>
              <p className="text-muted-foreground">
                Purchase premium movies from the catalog to watch anytime!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {purchasedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  inWatchlist={watchlistMovies.some(w => w.id === movie.id)}
                  isPurchased={true}
                  onWatchlistUpdate={fetchUserData}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}