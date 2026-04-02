
-- Create guest_responses table
CREATE TABLE public.guest_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  accompanied BOOLEAN NOT NULL DEFAULT false,
  companion_names TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RSVP (no auth required)
CREATE POLICY "Anyone can insert guest responses"
  ON public.guest_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view responses (admin)
CREATE POLICY "Authenticated users can view responses"
  ON public.guest_responses
  FOR SELECT
  TO authenticated
  USING (true);
