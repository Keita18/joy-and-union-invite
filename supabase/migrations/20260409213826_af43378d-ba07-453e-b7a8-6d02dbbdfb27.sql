-- Fix: allow authenticated users to also insert guest responses
CREATE POLICY "Authenticated users can insert guest responses"
ON public.guest_responses
FOR INSERT
TO authenticated
WITH CHECK (true);