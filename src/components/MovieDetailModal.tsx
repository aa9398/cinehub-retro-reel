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
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 ultra-pixel-card retro-scanlines">
          {/* Ultra HD Header Image */}
          <div className="relative h-80 md:h-96 pixel-grid">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            {movie.is_premium && (
              <Badge className="absolute top-4 right-4 pixel-badge animate-pixel-pulse">
                ⭐ PREMIUM ⭐
              </Badge>
            )}
            
            {/* Trailer Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <Button
                size="lg"
                onClick={() => setShowTrailer(true)}
                className="pixel-button text-lg px-8 py-4 shadow-neon hover:shadow-glow opacity-90 hover:opacity-100 transition-opacity"
              >
                <Play className="w-8 h-8 mr-3" />
                ▶ PLAY TRAILER
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Ultra Title and Basic Info */}
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-pixel text-2xl md:text-3xl text-primary leading-relaxed neon-glow">
                  ◆ {movie.title.toUpperCase()} ◆
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 pixel-badge">
                  <Calendar className="w-4 h-4" />
                  <span className="font-pixel text-xs">{movie.release_year}</span>
                </div>
                {movie.runtime_minutes && (
                  <div className="flex items-center gap-2 pixel-badge">
                    <Clock className="w-4 h-4" />
                    <span className="font-pixel text-xs">{Math.floor(movie.runtime_minutes / 60)}H {movie.runtime_minutes % 60}M</span>
                  </div>
                )}
                {movie.imdb_rating && (
                  <div className="flex items-center gap-2 pixel-badge bg-accent text-accent-foreground">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-pixel text-xs font-bold">{movie.imdb_rating}/10</span>
                  </div>
                )}
                {movie.country && (
                  <div className="flex items-center gap-2 pixel-badge">
                    <Globe className="w-4 h-4" />
                    <span className="font-pixel text-xs">{movie.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ultra Genre and Streaming */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="pixel-badge bg-primary text-primary-foreground font-bold">
                  ◆ {movie.genre.toUpperCase()} ◆
                </Badge>
                {movie.price > 0 && (
                  <Badge className="pixel-badge bg-destructive text-destructive-foreground animate-pixel-pulse">
                    💲 ${movie.price} USD
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-pixel text-xs text-accent">🎬 AVAILABLE ON:</h4>
                <div className="flex flex-wrap gap-3">
                  {movie.streaming_platforms.map((platform) => (
                    <Badge 
                      key={platform} 
                      className="pixel-badge bg-secondary/30 text-secondary-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      {platformIcons[platform] || '📺'} {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Ultra Description */}
            <div className="space-y-3 ultra-pixel-card p-6">
              <h3 className="font-pixel text-sm text-primary neon-glow">📋 ULTRA SYNOPSIS</h3>
              <p className="text-muted-foreground leading-relaxed text-base font-medium">
                {movie.description}
              </p>
            </div>

            {/* Ultra Cast and Crew */}
            {(movie.director || movie.cast_members?.length) && (
              <div className="ultra-pixel-card p-6 space-y-4">
                <h3 className="font-pixel text-sm text-accent neon-glow">🎭 CAST & CREW</h3>
                
                {movie.director && (
                  <div className="pixel-card p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-pixel text-xs text-primary">🎬 DIRECTOR:</span>
                    </div>
                    <p className="font-pixel text-sm text-foreground font-bold">{movie.director}</p>
                  </div>
                )}
                
                {movie.cast_members?.length && (
                  <div className="pixel-card p-4 space-y-2">
                    <h4 className="font-pixel text-xs text-primary flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      ⭐ STARRING CAST
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {movie.cast_members.slice(0, 8).map((actor, index) => (
                        <Badge key={index} className="pixel-badge justify-start text-left">
                          {actor}
                        </Badge>
                      ))}
                    </div>
                    {movie.cast_members.length > 8 && (
                      <p className="font-pixel text-xs text-muted-foreground mt-2">
                        +{movie.cast_members.length - 8} MORE ACTORS...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ultra Awards */}
            {movie.awards && (
              <div className="ultra-pixel-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-accent animate-pixel-pulse" />
                  <span className="font-pixel text-sm text-accent neon-glow">🏆 AWARDS & HONORS</span>
                </div>
                <p className="text-foreground font-medium leading-relaxed">{movie.awards}</p>
              </div>
            )}

            {/* Ultra Action Buttons */}
            <div className="ultra-pixel-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowTrailer(true)}
                  className="pixel-button bg-gradient-primary text-primary-foreground hover:shadow-neon col-span-1"
                >
                  <Play className="w-5 h-5 mr-2" />
                  ▶ TRAILER
                </Button>
                
                {user && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleWatchlistToggle}
                    disabled={loading}
                    className={`pixel-button hover:shadow-glow col-span-1 ${
                      inWatchlist 
                        ? 'bg-accent text-accent-foreground animate-pixel-pulse' 
                        : 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${inWatchlist ? 'fill-current' : ''}`} />
                    {inWatchlist ? '♥ SAVED' : '♡ SAVE'}
                  </Button>
                )}

                {movie.is_premium && movie.price > 0 && (
                  <Button
                    size="lg"
                    onClick={handlePurchase}
                    disabled={isPurchased}
                    className={`pixel-button col-span-1 ${
                      isPurchased
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90 animate-pixel-pulse'
                        : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-neon'
                    }`}
                  >
                    {isPurchased ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        ✓ OWNED
                      </>
                    ) : (
                      <>
                        <IndianRupee className="w-5 h-5 mr-2" />
                        💸 RENT ${movie.price}
                      </>
                    )}
                  </Button>
                )}
              </div>
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