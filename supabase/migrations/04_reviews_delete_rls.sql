-- Enable delete access only to admins for the reviews table
CREATE POLICY "Admins can delete reviews"
ON public.reviews
FOR DELETE
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
