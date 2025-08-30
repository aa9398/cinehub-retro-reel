import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-retro pixel-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Film className="h-12 w-12 text-primary animate-neon-glow" />
            <h1 className="font-retro text-4xl font-black text-primary animate-retro-flicker">
              CINEHUB
            </h1>
          </Link>
        </div>

        <Card className="ultra-pixel-card bg-card/90 backdrop-blur-sm retro-scanlines">
          <CardHeader className="text-center">
            <CardTitle className="font-retro text-2xl text-primary">
              {isSignUp ? 'JOIN THE GRID' : 'ENTER THE GRID'}
            </CardTitle>
            <CardDescription className="font-retro text-muted-foreground">
              {isSignUp 
                ? 'Create your account to access the movie database'
                : 'Sign in to access your personal movie collection'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-retro text-foreground">
                  EMAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-pixel text-xs border-2 border-border bg-input focus:border-primary focus:ring-primary shadow-pixel"
                  placeholder="your.email@domain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-retro text-foreground">
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="font-pixel text-xs border-2 border-border bg-input focus:border-primary focus:ring-primary shadow-pixel"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full pixel-button shadow-glow hover:shadow-neon"
              >
                {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="ghost"
                className="font-pixel text-xs text-primary hover:text-primary/80 hover:shadow-glow transition-[var(--transition-pixel)]"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp 
                  ? 'Already have an account? SIGN IN'
                  : "Don't have an account? SIGN UP"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}