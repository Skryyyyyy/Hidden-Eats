-- Seed default tags for craving filters
INSERT INTO public.tags (name, category) VALUES
  ('Biryani', 'mood'),
  ('Street Food', 'mood'),
  ('Budget Meals', 'budget'),
  ('Date Night', 'occasion'),
  ('Midnight Cravings', 'mood'),
  ('Hidden Gems', 'mood'),
  ('Cafe to Work', 'amenity'),
  ('Family Dinner', 'occasion')
ON CONFLICT (name) DO NOTHING;
