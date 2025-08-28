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
    <div className="min-h-screen bg-gradient-retro">
      {/* Animated Neon Logo Header */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-sm">
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
                className={`font-retro font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-foreground'
                }`}
              >
                CATALOG
              </Link>
              {user && (
                <>
                  <Link 
                    to="/watchlist" 
                    className={`font-retro font-medium transition-colors hover:text-primary ${
                      location.pathname === '/watchlist' ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    WATCHLIST
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className={`font-retro font-medium transition-colors hover:text-primary ${
                      location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    DASHBOARD
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
                    className="font-retro text-primary hover:bg-primary/20"
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
                    className="font-retro border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={signOut}
                  >
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="font-retro bg-gradient-neon-pink shadow-neon-pink hover:shadow-neon-blue"
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

      {/* Retro Footer */}
      <footer className="border-t border-primary/20 bg-background/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="font-retro text-muted-foreground">
              © 2024 CINEHUB - Your Retro Movie Experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}