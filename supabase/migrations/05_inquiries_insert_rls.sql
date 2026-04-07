-- Allow anyone to submit an inquiry (anon and authenticated)
CREATE POLICY "Inquiries can be submitted by anyone"
ON public.inquiries
FOR INSERT
USING (true)
WITH CHECK (true);
