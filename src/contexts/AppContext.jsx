import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { inventoryService, salesService, settingsService } from '../lib/supabase';

const AppContext = createContext();

const initialState = {
  inventory: [],
  sales: [],
  currentUser: null,
  isAuthenticated: false,
  settings: {
    adminPassword: '12345',
    shopName: 'සම්පත් ටයර් හවුස්',
    currency: 'LKR'
  },
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: 'admin' };
    
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, currentUser: null };
    
    case 'ADD_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_SALE':      
      return {
        ...state,
        sales: [...state.sales, action.payload]
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload, loading: false };
    
    case 'SET_SALES':
      return { ...state, sales: action.payload, loading: false };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Load settings
        const settings = await settingsService.get();
        dispatch({ type: 'SET_SETTINGS', payload: {
          adminPassword: settings.admin_password,
          shopName: settings.shop_name,
          currency: settings.currency
        }});
        
        // Load inventory
        const inventory = await inventoryService.getAll();
        const formattedInventory = inventory.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          barcode: item.barcode,
          category: item.category,
          subCategory: item.sub_category,
          tireSize: item.tire_size,
          price: parseFloat(item.price),
          quantity: item.quantity,
          minStock: item.min_stock,
          description: item.description,
          dateAdded: item.date_added,
          lastModified: item.last_modified
        }));
        dispatch({ type: 'SET_INVENTORY', payload: formattedInventory });
        
        // Load sales
        const sales = await salesService.getAll();
        const formattedSales = sales.map(sale => ({
          id: sale.id,
          billNumber: sale.bill_number,
          customerName: sale.customer_name,
          customerPhone: sale.customer_phone,
          total: parseFloat(sale.total_amount),
          cashier: sale.cashier,
          date: sale.sale_date,
          items: sale.sale_items.map(item => ({
            id: item.inventory_id,
            name: item.item_name,
            price: parseFloat(item.item_price),
            quantity: item.quantity
          }))
        }));
        dispatch({ type: 'SET_SALES', payload: formattedSales });
        
      } catch (error) {
        console.error('Error loading initial data:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    loadInitialData();
  }, []);

  // Enhanced dispatch with database operations
  const enhancedDispatch = async (action) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      switch (action.type) {
        case 'ADD_ITEM': {
          const newItem = await inventoryService.add(action.payload);
          const formattedItem = {
            id: newItem.id,
            name: newItem.name,
            brand: newItem.brand,
            barcode: newItem.barcode,
            category: newItem.category,
            subCategory: newItem.sub_category,
            tireSize: newItem.tire_size,
            price: parseFloat(newItem.price),
            quantity: newItem.quantity,
            minStock: newItem.min_stock,
            description: newItem.description,
            dateAdded: newItem.date_added,
            lastModified: newItem.last_modified
          };
          dispatch({ type: 'ADD_ITEM', payload: formattedItem });
          break;
        }
        
        case 'UPDATE_ITEM': {
          const updatedItem = await inventoryService.update(action.payload);
          const formattedItem = {
            id: updatedItem.id,
            name: updatedItem.name,
            brand: updatedItem.brand,
            barcode: updatedItem.barcode,
            category: updatedItem.category,
            subCategory: updatedItem.sub_category,
            tireSize: updatedItem.tire_size,
            price: parseFloat(updatedItem.price),
            quantity: updatedItem.quantity,
            minStock: updatedItem.min_stock,
            description: updatedItem.description,
            dateAdded: updatedItem.date_added,
            lastModified: updatedItem.last_modified
          };
          dispatch({ type: 'UPDATE_ITEM', payload: formattedItem });
          break;
        }
        
        case 'DELETE_ITEM': {
          await inventoryService.delete(action.payload);
          dispatch({ type: 'DELETE_ITEM', payload: action.payload });
          break;
        }
        
        case 'ADD_SALE': {
          const newSale = await salesService.add(action.payload);
          const formattedSale = {
            id: newSale.id,
            billNumber: newSale.bill_number,
            customerName: newSale.customer_name,
            customerPhone: newSale.customer_phone,
            total: parseFloat(newSale.total_amount),
            cashier: newSale.cashier,
            date: newSale.sale_date,
            items: action.payload.items
          };
          dispatch({ type: 'ADD_SALE', payload: formattedSale });
          
          // Reload inventory to get updated quantities
          const inventory = await inventoryService.getAll();
          const formattedInventory = inventory.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            barcode: item.barcode,
            category: item.category,
            subCategory: item.sub_category,
            tireSize: item.tire_size,
            price: parseFloat(item.price),
            quantity: item.quantity,
            minStock: item.min_stock,
            description: item.description,
            dateAdded: item.date_added,
            lastModified: item.last_modified
          }));
          dispatch({ type: 'SET_INVENTORY', payload: formattedInventory });
          break;
        }
        
        case 'UPDATE_SETTINGS': {
          const updatedSettings = await settingsService.update(action.payload);
          dispatch({ type: 'UPDATE_SETTINGS', payload: {
            adminPassword: updatedSettings.admin_password,
            shopName: updatedSettings.shop_name,
            currency: updatedSettings.currency
          }});
          break;
        }
        
        default:
          dispatch(action);
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Database operation error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};