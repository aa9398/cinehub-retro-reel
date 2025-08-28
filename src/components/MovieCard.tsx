import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Play, DollarSign, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoModal } from './VideoModal';

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
  const { user } = useAuth();
  const { toast } = useToast();

  const platformIcons: Record<string, string> = {
    'Netflix': '🇳',
    'Prime Video': '🅿️',
    'Disney+': '🇩',
    'Hulu': '🇭',
    'HBO Max': '🇭'
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
    
    // TODO: Implement Stripe checkout
    toast({
      title: "Coming Soon",
      description: "Stripe integration will be added next!",
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-vhs">
        {/* VHS-style design elements */}
        <div className="absolute top-2 left-2 w-4 h-2 bg-secondary rounded-full opacity-60" />
        <div className="absolute top-2 right-2 w-4 h-2 bg-accent rounded-full opacity-60" />
        
        <div className="relative">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {movie.is_premium && (
            <Badge className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gradient-neon-pink shadow-neon-pink font-retro">
              PREMIUM
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-retro font-bold text-lg text-foreground mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {movie.release_year} • {movie.genre}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {movie.description}
          </p>
          
          {/* Streaming Platforms */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.streaming_platforms.map((platform) => (
              <Badge 
                key={platform} 
                variant="secondary" 
                className="text-xs font-retro bg-secondary/20 text-secondary border-secondary/40"
              >
                {platformIcons[platform] || '📺'} {platform}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTrailer(true)}
              className="flex-1 font-retro border-primary/40 text-primary hover:bg-primary/20"
            >
              <Play className="w-4 h-4 mr-1" />
              TRAILER
            </Button>
            
            {user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleWatchlistToggle}
                disabled={loading}
                className={`font-retro hover:bg-accent/20 ${
                  inWatchlist ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>

          {movie.is_premium && movie.price > 0 && (
            <Button
              size="sm"
              onClick={handlePurchase}
              disabled={isPurchased}
              className={`w-full font-retro ${
                isPurchased
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-gradient-neon-blue shadow-neon-blue hover:shadow-neon-green'
              }`}
            >
              {isPurchased ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  OWNED
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-1" />
                  RENT ${movie.price}
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
    </>
  );
}