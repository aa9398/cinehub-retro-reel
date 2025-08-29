import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Award, Globe, Calendar, User, Heart, Play, IndianRupee, Check } from 'lucide-react';
import { useState } from 'react';
import { VideoModal } from './VideoModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  inWatchlist?: boolean;
  isPurchased?: boolean;
  onWatchlistUpdate?: () => void;
}

export function MovieDetailModal({ 
  movie, 
  isOpen, 
  onClose, 
  inWatchlist = false, 
  isPurchased = false,
  onWatchlistUpdate 
}: MovieDetailModalProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!movie) return null;

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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-border shadow-pixel">
          {/* Header Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            {movie.is_premium && (
              <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground font-pixel text-xs">
                PREMIUM
              </Badge>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Title and Basic Info */}
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="font-pixel text-xl md:text-2xl text-foreground leading-relaxed">
                  {movie.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.release_year}</span>
                </div>
                {movie.runtime_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.runtime_minutes / 60)}h {movie.runtime_minutes % 60}m</span>
                  </div>
                )}
                {movie.imdb_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-accent" />
                    <span className="font-medium">{movie.imdb_rating}/10</span>
                  </div>
                )}
                {movie.country && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{movie.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genre and Streaming */}
            <div className="space-y-3">
              <Badge variant="outline" className="font-pixel text-xs">
                {movie.genre}
              </Badge>
              
              <div className="flex flex-wrap gap-2">
                {movie.streaming_platforms.map((platform) => (
                  <Badge 
                    key={platform} 
                    variant="secondary" 
                    className="text-xs bg-secondary/20 text-secondary-foreground border-secondary/40"
                  >
                    {platformIcons[platform] || '📺'} {platform}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-pixel text-sm text-foreground">SYNOPSIS</h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Cast and Crew */}
            {(movie.director || movie.cast_members?.length) && (
              <div className="space-y-3">
                {movie.director && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="font-pixel text-xs text-foreground">DIRECTOR:</span>
                      <p className="text-sm text-muted-foreground">{movie.director}</p>
                    </div>
                  </div>
                )}
                
                {movie.cast_members?.length && (
                  <div>
                    <h4 className="font-pixel text-xs text-foreground mb-2">CAST</h4>
                    <p className="text-sm text-muted-foreground">
                      {movie.cast_members.slice(0, 5).join(', ')}
                      {movie.cast_members.length > 5 && '...'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Awards */}
            {movie.awards && (
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <span className="font-pixel text-xs text-foreground">AWARDS:</span>
                  <p className="text-sm text-muted-foreground">{movie.awards}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowTrailer(true)}
                className="flex-1 font-pixel text-xs border border-primary/40 hover:bg-primary/10 transition-[var(--transition-pixel)]"
              >
                <Play className="w-4 h-4 mr-2" />
                WATCH TRAILER
              </Button>
              
              {user && (
                <Button
                  variant="ghost"
                  onClick={handleWatchlistToggle}
                  disabled={loading}
                  className={`font-pixel text-xs hover:bg-accent/10 transition-[var(--transition-pixel)] ${
                    inWatchlist ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${inWatchlist ? 'fill-current' : ''}`} />
                  {inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}
                </Button>
              )}

              {movie.is_premium && movie.price > 0 && (
                <Button
                  onClick={handlePurchase}
                  disabled={isPurchased}
                  className={`flex-1 font-pixel text-xs transition-[var(--transition-pixel)] ${
                    isPurchased
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isPurchased ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      OWNED
                    </>
                  ) : (
                    <>
                      <IndianRupee className="w-4 h-4 mr-2" />
                      RENT ₹{movie.price}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VideoModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        videoUrl={movie.trailer_link}
        title={movie.title}
      />
    </>
  );
}