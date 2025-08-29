-- Add IMDB score and additional movie metadata
ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS imdb_rating DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS runtime_minutes INTEGER,
ADD COLUMN IF NOT EXISTS director TEXT,
ADD COLUMN IF NOT EXISTS cast_members TEXT[],
ADD COLUMN IF NOT EXISTS awards TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Clear existing data safely
TRUNCATE TABLE public.watchlist, public.purchased_movies, public.movies CASCADE;

-- Insert comprehensive movie catalog with INR prices
INSERT INTO public.movies (
  title, description, release_year, genre, poster_url, trailer_link, 
  streaming_platforms, price, is_premium, imdb_rating, runtime_minutes, 
  director, cast_members, awards, country
) VALUES

-- Top IMDB Movies & Series (Prices in INR)
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 'Drama', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=6hB3S9bIaco', ARRAY['Netflix', 'Prime Video'], 249, true, 9.3, 142, 'Frank Darabont', ARRAY['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'], 'Nominated for 7 Academy Awards', 'USA'),

('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=sY1S34973zA', ARRAY['Prime Video', 'Paramount+'], 329, true, 9.2, 175, 'Francis Ford Coppola', ARRAY['Marlon Brando', 'Al Pacino', 'James Caan'], '3 Academy Awards', 'USA'),

('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 2008, 'Action', 'https://images.unsplash.com/photo-1509347528160-9329f9dd50a5?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', ARRAY['HBO Max', 'Prime Video'], 199, true, 9.0, 152, 'Christopher Nolan', ARRAY['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'], '2 Academy Awards', 'USA'),

('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 1994, 'Crime', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', ARRAY['Netflix', 'Prime Video'], 149, false, 8.9, 154, 'Quentin Tarantino', ARRAY['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'], 'Academy Award for Best Original Screenplay', 'USA'),

('Breaking Bad', 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.', 2008, 'Crime', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=HhesaQXLuRY', ARRAY['Netflix'], 399, true, 9.5, 47, 'Vince Gilligan', ARRAY['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'], '16 Emmy Awards', 'USA'),

('Game of Thrones', 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns.', 2011, 'Fantasy', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=rlR4PJn8b8I', ARRAY['HBO Max'], 499, true, 9.3, 57, 'David Benioff', ARRAY['Peter Dinklage', 'Lena Headey', 'Emilia Clarke'], '59 Emmy Awards', 'USA'),

('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 2010, 'Sci-Fi', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=YoHD9XEInc0', ARRAY['HBO Max', 'Prime Video'], 249, true, 8.8, 148, 'Christopher Nolan', ARRAY['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'], '4 Academy Awards', 'USA'),

('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 'Sci-Fi', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', ARRAY['HBO Max', 'Prime Video'], 249, true, 8.6, 169, 'Christopher Nolan', ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], 'Academy Award for Best Visual Effects', 'USA'),

('3 Idiots', 'Two friends search for their long lost companion. They have a lead - the film is about three friends whose lives have changed.', 2009, 'Comedy', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=K0eDlFX9GMc', ARRAY['Netflix', 'Prime Video'], 149, false, 8.4, 170, 'Rajkumar Hirani', ARRAY['Aamir Khan', 'R. Madhavan', 'Sharman Joshi'], '3 Filmfare Awards', 'India'),

('Dangal', 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games.', 2016, 'Biography', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=x_7YlGv9u1g', ARRAY['Netflix'], 199, false, 8.4, 161, 'Nitesh Tiwari', ARRAY['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh'], '4 National Film Awards', 'India'),

('Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 2019, 'Thriller', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=5xH0HfJHsaY', ARRAY['Hulu'], 249, true, 8.6, 132, 'Bong Joon-ho', ARRAY['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'], '4 Academy Awards including Best Picture', 'South Korea'),

('Avengers: Endgame', 'After the devastating events of Infinity War, the Avengers assemble once more to undo Thanos actions and restore order.', 2019, 'Action', 'https://images.unsplash.com/photo-1509347528160-9329f9dd50a5?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', ARRAY['Disney+'], 299, true, 8.4, 181, 'Anthony Russo', ARRAY['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'], 'Nominated for Academy Award', 'USA'),

('Forrest Gump', 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold through the perspective of an Alabama man with an IQ of 75.', 1994, 'Drama', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=bLvqoHBptjg', ARRAY['Netflix', 'Prime Video'], 149, false, 8.8, 142, 'Robert Zemeckis', ARRAY['Tom Hanks', 'Robin Wright', 'Gary Sinise'], '6 Academy Awards', 'USA'),

('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much more.', 1999, 'Drama', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=SUXWAEX2jlg', ARRAY['Netflix', 'Hulu'], 149, false, 8.8, 139, 'David Fincher', ARRAY['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'], 'Nominated for Academy Award', 'USA'),

('Spirited Away', 'During her familys move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', 2001, 'Animation', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=ByXuk9QqQkk', ARRAY['HBO Max'], 149, false, 9.2, 125, 'Hayao Miyazaki', ARRAY['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'], 'Academy Award for Best Animated Feature', 'Japan'),

('Se7en', 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.', 1995, 'Thriller', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=znmZoVkCjpI', ARRAY['Netflix'], 149, false, 8.6, 127, 'David Fincher', ARRAY['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey'], 'Academy Award nomination', 'USA'),

('The Silence of the Lambs', 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', 1991, 'Thriller', 'https://images.unsplash.com/photo-1489599559460-e8ba010954fc?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=W6Mm8Sbe__o', ARRAY['Prime Video'], 149, false, 8.6, 118, 'Jonathan Demme', ARRAY['Jodie Foster', 'Anthony Hopkins', 'Scott Glenn'], '5 Academy Awards', 'USA'),

('Spider-Man: No Way Home', 'With Spider-Mans identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', 2021, 'Action', 'https://images.unsplash.com/photo-1509347528160-9329f9dd50a5?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=JfVOs4VSpmA', ARRAY['Netflix'], 249, true, 8.4, 148, 'Jon Watts', ARRAY['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'], 'Academy Award nomination', 'USA'),

('Top Gun: Maverick', 'After more than thirty years of service as one of the Navys top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.', 2022, 'Action', 'https://images.unsplash.com/photo-1509347528160-9329f9dd50a5?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=qSqVVswa420', ARRAY['Prime Video'], 329, true, 8.3, 130, 'Joseph Kosinski', ARRAY['Tom Cruise', 'Jennifer Connelly', 'Miles Teller'], '6 Academy Award nominations', 'USA'),

('Dune', 'A noble family becomes embroiled in a war for control over the galaxys most valuable asset while its heir becomes troubled by visions of a dark future.', 2021, 'Sci-Fi', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=n9xhJrPXop4', ARRAY['HBO Max'], 299, true, 8.0, 155, 'Denis Villeneuve', ARRAY['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'], '6 Academy Awards', 'USA'),

('Goodfellas', 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.', 1990, 'Crime', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 'https://www.youtube.com/watch?v=qo5jJpHtI1Y', ARRAY['HBO Max'], 199, true, 8.7, 146, 'Martin Scorsese', ARRAY['Robert De Niro', 'Ray Liotta', 'Joe Pesci'], 'Academy Award for Best Supporting Actor', 'USA');