-- Update database to add linkedin column to gebruikers table
USE careerlaunch;

-- Add linkedin column to existing gebruikers table if it doesn't exist
ALTER TABLE gebruikers ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);

-- Verify the column was added
DESCRIBE gebruikers; 