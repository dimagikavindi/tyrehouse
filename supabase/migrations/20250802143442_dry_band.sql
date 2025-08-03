/*
  # Update admin password to 12345

  1. Changes
    - Update admin password from 'admin123' to '12345'
    - This affects the settings table default value
*/

UPDATE settings SET admin_password = '12345' WHERE admin_password = 'admin123';

-- Update the default for new records
ALTER TABLE settings ALTER COLUMN admin_password SET DEFAULT '12345';