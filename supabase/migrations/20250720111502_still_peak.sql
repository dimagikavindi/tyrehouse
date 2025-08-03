/*
  # Add is_active column to inventory table

  1. Changes
    - Add `is_active` boolean column to inventory table with default value TRUE
    - Update existing records to set is_active = TRUE
    - Add index on is_active column for better query performance

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

-- Add is_active column to inventory table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE inventory ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Update existing records to be active
UPDATE inventory SET is_active = true WHERE is_active IS NULL;

-- Add index for better performance on active items queries
CREATE INDEX IF NOT EXISTS idx_inventory_is_active ON inventory(is_active);