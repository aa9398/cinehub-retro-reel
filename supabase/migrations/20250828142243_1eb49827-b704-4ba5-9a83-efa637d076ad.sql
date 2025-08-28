-- Create movies table with all required fields
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  release_year INTEGER,
  genre TEXT,
  poster_url TEXT,
  trailer_link TEXT,
  streaming_platforms TEXT[], -- Array of platform names
  price DECIMAL(10,2), -- For rental/purchase price
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Create purchased movies table
CREATE TABLE public.purchased_movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS on all tables
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_movies ENABLE ROW LEVEL SECURITY;

-- RLS policies for movies (public read)
CREATE POLICY "movies_select_all" ON public.movies FOR SELECT USING (true);

-- RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS policies for watchlist
CREATE POLICY "watchlist_select_own" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "watchlist_insert_own" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "watchlist_delete_own" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for purchased movies
CREATE POLICY "purchased_select_own" ON public.purchased_movies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "purchased_insert_own" ON public.purchased_movies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create profile on user signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert mock movie data
INSERT INTO public.movies (title, description, release_year, genre, poster_url, trailer_link, streaming_platforms, price, is_premium) VALUES
('Blade Runner 2049', 'A young blade runner discovers a secret that could plunge society into chaos.', 2017, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', 'https://www.youtube.com/watch?v=gCcx85zbxz4', ARRAY['Netflix', 'Prime Video'], 4.99, true),
('The Terminator', 'A cyborg assassin is sent back in time to kill the mother of humanity''s savior.', 1984, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg', 'https://www.youtube.com/watch?v=k64P4l2Wmeg', ARRAY['Prime Video'], 3.99, true),
('Back to the Future', 'A teenager travels back in time and accidentally prevents his parents from meeting.', 1985, 'Adventure', 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', 'https://www.youtube.com/watch?v=qvsgGtivCgs', ARRAY['Netflix', 'Disney+'], 0, false),
('Tron: Legacy', 'Sam Flynn investigates his father''s disappearance and finds himself pulled into the digital world.', 2010, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/vuifSABRpSnxCAOxEnWpNbZSXpp.jpg', 'https://www.youtube.com/watch?v=L9szn1QQfas', ARRAY['Disney+'], 5.99, true),
('The Matrix', 'A computer programmer discovers reality is a simulation and joins a rebellion.', 1999, 'Sci-Fi', 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', ARRAY['Netflix', 'Prime Video'], 0, false),
('Ghost in the Shell', 'In a cyberpunk future, a cyborg policewoman hunts a mysterious hacker.', 1995, 'Anime', 'https://image.tmdb.org/t/p/w500/oDM30m5xUIxnYETSzynOKcOlSYT.jpg', 'https://www.youtube.com/watch?v=SvBVDibOrgs', ARRAY['Prime Video'], 6.99, true),
('Akira', 'In Neo-Tokyo, a biker gang member gains telepathic abilities.', 1988, 'Anime', 'https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg', 'https://www.youtube.com/watch?v=t1GO_j67ExU', ARRAY['Netflix'], 0, false),
('Miami Vice', 'Two undercover cops infiltrate a drug cartel in 1980s Miami.', 2006, 'Action', 'https://image.tmdb.org/t/p/w500/7ksOcKNBSgoF3wI2DF9LLuVzrdl.jpg', 'https://www.youtube.com/watch?v=HJf-gb4KzZM', ARRAY['Prime Video'], 4.99, true);