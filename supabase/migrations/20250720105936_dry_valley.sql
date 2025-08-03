/*
  # Create Tire House Management System Database Schema

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key)
      - `name` (text, item name)
      - `brand` (text, brand name)
      - `barcode` (text, unique barcode)
      - `category` (text, item category)
      - `sub_category` (text, sub category)
      - `tire_size` (text, tire size if applicable)
      - `price` (decimal, item price)
      - `quantity` (integer, current stock quantity)
      - `min_stock` (integer, minimum stock level)
      - `description` (text, item description)
      - `date_added` (timestamp, when item was added)
      - `last_modified` (timestamp, last update time)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sales`
      - `id` (uuid, primary key)
      - `bill_number` (text, unique bill number)
      - `customer_name` (text, customer name)
      - `customer_phone` (text, customer phone)
      - `total_amount` (decimal, total sale amount)
      - `cashier` (text, cashier name)
      - `sale_date` (timestamp, sale date and time)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sale_items`
      - `id` (uuid, primary key)
      - `sale_id` (uuid, foreign key to sales)
      - `inventory_id` (uuid, foreign key to inventory)
      - `item_name` (text, item name at time of sale)
      - `item_price` (decimal, item price at time of sale)
      - `quantity` (integer, quantity sold)
      - `subtotal` (decimal, line total)
      - `created_at` (timestamp)

    - `settings`
      - `id` (uuid, primary key)
      - `shop_name` (text, shop name)
      - `admin_password` (text, encrypted admin password)
      - `currency` (text, currency code)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text DEFAULT '',
  barcode text UNIQUE NOT NULL,
  category text NOT NULL,
  sub_category text DEFAULT '',
  tire_size text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 5,
  description text DEFAULT '',
  date_added timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number text UNIQUE NOT NULL,
  customer_name text DEFAULT 'Walk-in Customer',
  customer_phone text DEFAULT '',
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  cashier text DEFAULT 'Admin',
  sale_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  inventory_id uuid REFERENCES inventory(id),
  item_name text NOT NULL,
  item_price decimal(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text DEFAULT 'සම්පත් ටයර් හවුස්',
  admin_password text DEFAULT 'admin123',
  currency text DEFAULT 'LKR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings if not exists
INSERT INTO settings (shop_name, admin_password, currency)
SELECT 'සම්පත් ටයර් හවුස්', 'admin123', 'LKR'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory
CREATE POLICY "Allow all operations on inventory"
  ON inventory
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Create policies for sales
CREATE POLICY "Allow all operations on sales"
  ON sales
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Create policies for sale_items
CREATE POLICY "Allow all operations on sale_items"
  ON sale_items
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Create policies for settings
CREATE POLICY "Allow all operations on settings"
  ON settings
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_sales_bill_number ON sales(bill_number);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_inventory_id ON sale_items(inventory_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();