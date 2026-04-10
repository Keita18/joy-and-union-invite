CREATE POLICY "Authenticated users can delete responses"
ON public.guest_responses
FOR DELETE
TO authenticated
USING (true);