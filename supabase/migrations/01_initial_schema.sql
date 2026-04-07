-- Ensure updated_at column exists on inquiries and reviews
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create trigger function if it doesn't already exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS set_timestamp_inquiries on inquiries;
CREATE TRIGGER set_timestamp_inquiries
BEFORE UPDATE ON inquiries
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_reviews on reviews;
CREATE TRIGGER set_timestamp_reviews
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
