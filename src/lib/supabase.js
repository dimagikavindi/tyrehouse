import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database service functions
export const inventoryService = {
  // Get all inventory items
  async getAll() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Add new inventory item
  async add(item) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([{
        name: item.name,
        brand: item.brand || '',
        barcode: item.barcode,
        category: item.category,
        sub_category: item.subCategory || '',
        tire_size: item.tireSize || '',
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        min_stock: parseInt(item.minStock) || 5,
        description: item.description || '',
        date_added: new Date().toISOString(),
        is_active: true
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update inventory item
  async update(item) {
    const { data, error } = await supabase
      .from('inventory')
      .update({
        name: item.name,
        brand: item.brand || '',
        barcode: item.barcode,
        category: item.category,
        sub_category: item.subCategory || '',
        tire_size: item.tireSize || '',
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        min_stock: parseInt(item.minStock) || 5,
        description: item.description || '',
        last_modified: new Date().toISOString()
      })
      .eq('id', item.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete inventory item
  async delete(id) {
    const { data, error } = await supabase
      .from('inventory')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update quantity after sale
  async updateQuantity(id, newQuantity) {
    const { data, error } = await supabase
      .from('inventory')
      .update({ 
        quantity: newQuantity,
        last_modified: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const salesService = {
  // Get all sales
  async getAll() {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          id,
          inventory_id,
          item_name,
          item_price,
          quantity,
          subtotal
        )
      `)
      .order('sale_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Check if inventory item has associated sales
  async hasSalesForItem(inventoryId) {
    const { data, error } = await supabase
      .from('sale_items')
      .select('id')
      .eq('inventory_id', inventoryId)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0;
  },

  // Add new sale
  async add(sale) {
    // Start a transaction-like operation
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        bill_number: sale.billNumber,
        customer_name: sale.customerName || 'Walk-in Customer',
        customer_phone: sale.customerPhone || '',
        total_amount: parseFloat(sale.total),
        cashier: sale.cashier || 'Admin',
        sale_date: new Date(sale.date).toISOString()
      }])
      .select()
      .single();
    
    if (saleError) throw saleError;

    // Add sale items
    const saleItems = sale.items.map(item => ({
      sale_id: saleData.id,
      inventory_id: item.id,
      item_name: item.name,
      item_price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      subtotal: parseFloat(item.price) * parseInt(item.quantity)
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);
    
    if (itemsError) throw itemsError;

    // Update inventory quantities
    for (const item of sale.items) {
      const { data: currentItem } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', item.id)
        .single();
      
      if (currentItem) {
        await supabase
          .from('inventory')
          .update({ 
            quantity: currentItem.quantity - item.quantity,
            last_modified: new Date().toISOString()
          })
          .eq('id', item.id);
      }
    }

    return { ...saleData, sale_items: saleItems };
  }
};

export const settingsService = {
  // Get settings
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || {
      shop_name: 'සම්පත් ටයර් හවුස්',
      admin_password: '12345',
      currency: 'LKR'
    };
  },

  // Update settings
  async update(settings) {
    // First check if settings exist
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('settings')
        .update({
          shop_name: settings.shopName,
          admin_password: settings.adminPassword,
          currency: settings.currency || 'LKR'
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          shop_name: settings.shopName,
          admin_password: settings.adminPassword,
          currency: settings.currency || 'LKR'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};