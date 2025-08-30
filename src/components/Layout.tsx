import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, Film, Heart, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-retro pixel-grid">
      {/* Ultra Pixel Header */}
      <header className="sticky top-0 z-50 border-b-4 border-border bg-card/90 backdrop-blur-sm shadow-pixel">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-primary animate-neon-glow" />
              <h1 className="font-retro text-3xl font-black text-primary animate-retro-flicker">
                CINEHUB
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`font-pixel text-xs font-medium transition-colors hover:text-primary hover:shadow-glow ${
                  location.pathname === '/' ? 'text-primary neon-glow' : 'text-foreground'
                }`}
              >
                ◆ CATALOG ◆
              </Link>
              <Link 
                to="/top-100-movies" 
                className={`font-pixel text-xs font-medium transition-colors hover:text-primary hover:shadow-glow ${
                  location.pathname === '/top-100-movies' ? 'text-primary neon-glow' : 'text-foreground'
                }`}
              >
                🏆 TOP MOVIES
              </Link>
              <Link 
                to="/top-100-series" 
                className={`font-pixel text-xs font-medium transition-colors hover:text-primary hover:shadow-glow ${
                  location.pathname === '/top-100-series' ? 'text-primary neon-glow' : 'text-foreground'
                }`}
              >
                📺 TOP SERIES
              </Link>
              {user && (
                <>
                  <Link 
                    to="/watchlist" 
                    className={`font-pixel text-xs font-medium transition-colors hover:text-primary hover:shadow-glow ${
                      location.pathname === '/watchlist' ? 'text-primary neon-glow' : 'text-foreground'
                    }`}
                  >
                    ♦ WATCHLIST ♦
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className={`font-pixel text-xs font-medium transition-colors hover:text-primary hover:shadow-glow ${
                      location.pathname === '/dashboard' ? 'text-primary neon-glow' : 'text-foreground'
                    }`}
                  >
                    ★ DASHBOARD ★
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-pixel text-xs text-primary hover:bg-primary/20 hover:shadow-glow transition-[var(--transition-pixel)]"
                    asChild
                  >
                    <Link to="/dashboard">
                      <User className="h-4 w-4 mr-1" />
                      PROFILE
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-pixel text-xs border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-pixel hover:shadow-glow transition-[var(--transition-pixel)]"
                    onClick={signOut}
                  >
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="pixel-button shadow-glow hover:shadow-neon"
                  asChild
                >
                  <Link to="/auth">LOGIN</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Ultra Pixel Footer */}
      <footer className="border-t-4 border-border bg-card/50 backdrop-blur-sm mt-20 shadow-pixel">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-pixel text-xs text-muted-foreground">
              ◆ © 2024 CINEHUB - ULTRA PIXEL MOVIE ARCHIVE ◆
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}