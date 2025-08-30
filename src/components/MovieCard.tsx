import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Play, IndianRupee, Check, Star, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoModal } from './VideoModal';
import { MovieDetailModal } from './MovieDetailModal';

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

interface MovieCardProps {
  movie: Movie;
  inWatchlist?: boolean;
  isPurchased?: boolean;
  onWatchlistUpdate?: () => void;
}

export function MovieCard({ 
  movie, 
  inWatchlist = false, 
  isPurchased = false,
  onWatchlistUpdate 
}: MovieCardProps) {
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const platformIcons: Record<string, string> = {
    'Netflix': '🇳',
    'Prime Video': '🅿️',
    'Disney+': '🇩',
    'Hulu': '🇭',
    'HBO Max': '🇭',
    'Paramount+': '🇵'
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your watchlist",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (inWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);

        if (error) throw error;

        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your watchlist`
        });
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: movie.id
          });

        if (error) throw error;

        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your watchlist`
        });
      }
      
      onWatchlistUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to purchase movies",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: "Stripe integration will be added next!",
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden pixel-card hover:shadow-glow transition-[var(--transition-smooth)] cursor-pointer retro-scanlines">
        
        <div className="relative" onClick={() => setShowDetail(true)}>
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
          {movie.is_premium && (
            <Badge className="absolute top-2 left-2 pixel-badge animate-pixel-pulse">
              ⭐ PREMIUM
            </Badge>
          )}
          {movie.imdb_rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary/90 px-2 py-1 shadow-pixel font-pixel text-[10px]">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-primary-foreground">{movie.imdb_rating}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-pixel text-xs text-foreground leading-relaxed line-clamp-2 min-h-[2rem]">
              {movie.title.toUpperCase()}
            </h3>
            <p className="text-muted-foreground text-xs">
              {movie.release_year} • {movie.genre}
            </p>
          </div>
          
          {/* Streaming Platforms */}
          <div className="flex flex-wrap gap-1">
            {movie.streaming_platforms.slice(0, 2).map((platform) => (
              <Badge 
                key={platform} 
                variant="outline" 
                className="text-xs bg-secondary/10 text-secondary border-secondary/20"
              >
                {platformIcons[platform] || '📺'} {platform}
              </Badge>
            ))}
            {movie.streaming_platforms.length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted/10 text-muted-foreground border-border">
                +{movie.streaming_platforms.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(true);
              }}
              className="flex-1 pixel-button hover:animate-glitch"
            >
              <Play className="w-3 h-3 mr-1" />
              TRAILER
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(true);
              }}
              className="font-pixel text-xs hover:bg-accent/20 text-muted-foreground hover:text-accent transition-[var(--transition-pixel)] hover:shadow-glow"
            >
              <Info className="w-3 h-3" />
            </Button>
            
            {user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchlistToggle();
                }}
                disabled={loading}
                className={`font-pixel text-xs hover:bg-accent/20 transition-[var(--transition-pixel)] hover:shadow-glow ${
                  inWatchlist ? 'text-accent animate-pixel-pulse' : 'text-muted-foreground hover:text-accent'
                }`}
              >
                <Heart className={`w-3 h-3 ${inWatchlist ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>

          {movie.is_premium && movie.price > 0 && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePurchase();
              }}
              disabled={isPurchased}
              className={`w-full pixel-button ${
                isPurchased
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90 animate-pixel-pulse'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow'
              }`}
            >
              {isPurchased ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  OWNED
                </>
              ) : (
                <>
                  <IndianRupee className="w-3 h-3 mr-1" />
                  RENT ₹{movie.price}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      <VideoModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        videoUrl={movie.trailer_link}
        title={movie.title}
      />

      <MovieDetailModal
        movie={movie}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        inWatchlist={inWatchlist}
        isPurchased={isPurchased}
        onWatchlistUpdate={onWatchlistUpdate}
      />
    </>
  );
}