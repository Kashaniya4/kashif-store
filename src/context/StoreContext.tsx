'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, User, PromoCode, OrderStatus, CourierName, PaymentMethod } from '@/types/store';
import productsData from '@/data/products.json';
import promoCodesData from '@/data/promocodes.json';

export interface Toast {
  id: string;
  message: string;
  type: 'cart' | 'wishlist' | 'info';
  productName?: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  activePromo: PromoCode | null;
  promoError: string | null;
  availablePromos: PromoCode[];
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  wishlist: string[];
  recentlyViewed: Product[];
  toasts: Toast[];
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setUser: (user: User | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, courier?: CourierName, trackingNumber?: string) => void;
  deleteOrder: (orderId: string) => void;
  getStock: (productId: string) => number;
  importProducts: (newProducts: Product[]) => void;
  // Product Management
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Product) => void;
  getCartSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  trackRecentlyViewed: (product: Product) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PK-982410',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { product: productsData[0] as unknown as Product, quantity: 1 }
    ],
    customer: {
      fullName: 'Hamza Malik',
      email: 'hamza.malik@example.pk',
      phone: '03001234567',
      city: 'Lahore',
      address: 'House 42, Block C, DHA Phase 5',
      isGuest: false
    },
    subtotal: 7000,
    discount: 700,
    shippingFee: 0,
    total: 6300,
    paymentMethod: 'jazzcash',
    paymentStatus: 'paid',
    transactionId: 'JC-88349120',
    status: 'shipped',
    courier: 'TCS Express',
    trackingNumber: 'TCS-991823412',
    promoCodeApplied: 'WELCOME10'
  },
  {
    id: 'ord-1002',
    orderNumber: 'PK-982411',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      { product: productsData[1] as unknown as Product, quantity: 2 }
    ],
    customer: {
      fullName: 'Ayesha Khan',
      email: 'ayesha.k@example.pk',
      phone: '03129876543',
      city: 'Karachi',
      address: 'Apartment 4B, Clifton Block 2',
      isGuest: true
    },
    subtotal: 6398,
    discount: 500,
    shippingFee: 250,
    total: 6148,
    paymentMethod: 'easypaisa',
    paymentStatus: 'paid',
    transactionId: 'EP-7741902',
    status: 'processing',
    courier: 'Leopards Courier',
    trackingNumber: 'LEO-4412093',
    promoCodeApplied: 'PAKISTAN500'
  }
];

// Merge initial products with any persisted stock overrides
const getInitialProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem('pk_store_stock');
    if (saved) {
      const stockMap: Record<string, number> = JSON.parse(saved);
      return productsData.map(p => ({
        ...(p as unknown as Product),
        stock: stockMap[p.id] ?? p.stock,
      }));
    }
  } catch (e) { /* ignore */ }
  return [...productsData] as unknown as Product[];
};

const getInitialPromos = (): PromoCode[] => [...promoCodesData] as unknown as PromoCode[];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(productsData as unknown as Product[]);
  const [availablePromos, setAvailablePromos] = useState<PromoCode[]>(promoCodesData as unknown as PromoCode[]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart, user, orders, products (with stock overrides) from localStorage
  useEffect(() => {
    try {
      setProducts(getInitialProducts());

      const savedCart = localStorage.getItem('pk_store_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUser = localStorage.getItem('pk_store_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedOrders = localStorage.getItem('pk_store_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(INITIAL_SAMPLE_ORDERS);
        localStorage.setItem('pk_store_orders', JSON.stringify(INITIAL_SAMPLE_ORDERS));
      }

      const savedWishlist = localStorage.getItem('pk_store_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedRecents = localStorage.getItem('pk_store_recent');
      if (savedRecents) setRecentlyViewed(JSON.parse(savedRecents));
    } catch (e) {
      console.error('LocalStorage load error:', e);
      setOrders(INITIAL_SAMPLE_ORDERS);
    }
    setIsLoaded(true);
  }, []);

  // Save stock map whenever products change
  useEffect(() => {
    if (isLoaded) {
      const stockMap: Record<string, number> = {};
      products.forEach(p => { stockMap[p.id] = p.stock; });
      localStorage.setItem('pk_store_stock', JSON.stringify(stockMap));
    }
  }, [products, isLoaded]);

  // Save Cart updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pk_store_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save User updates
  useEffect(() => {
    if (isLoaded) {
      if (user) localStorage.setItem('pk_store_user', JSON.stringify(user));
      else localStorage.removeItem('pk_store_user');
    }
  }, [user, isLoaded]);

  // Save Orders updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pk_store_orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  // Save Wishlist updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pk_store_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Save Recently Viewed updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pk_store_recent', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoaded]);

  const showToast = useCallback((message: string, type: 'cart' | 'wishlist' | 'info' = 'info', productName?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev.slice(-3), { id, message, type, productName }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const targetProduct = products.find(p => p.id === productId);
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'wishlist', targetProduct?.name);
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist', 'wishlist', targetProduct?.name);
        return [...prev, productId];
      }
    });
  }, [products, showToast]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const trackRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }, []);

  const getStock = useCallback((productId: string): number => {
    return products.find(p => p.id === productId)?.stock ?? 0;
  }, [products]);

  const addToCart = useCallback((product: Product, quantity = 1): boolean => {
    const currentStock = products.find(p => p.id === product.id)?.stock ?? 0;
    const alreadyInCart = cart.find(item => item.product.id === product.id)?.quantity ?? 0;
    const totalDesired = alreadyInCart + quantity;

    if (totalDesired > currentStock) {
      // Can't add more than stock — silently fail (cart button already disabled)
      return false;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast('Added to cart', 'cart', product.name);
    setIsCartOpen(true);
    return true;
  }, [products, cart, showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const currentStock = products.find(p => p.id === productId)?.stock ?? 0;
    const capped = Math.min(quantity, currentStock);
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: capped } : item
      )
    );
  }, [products, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setActivePromo(null);
  }, []);

  const getCartSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const applyPromoCode = useCallback((code: string): boolean => {
    setPromoError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = availablePromos.find(p => p.code.toUpperCase() === cleanCode);

    if (!found) {
      setPromoError('Invalid promo code. Please check the code and try again.');
      return false;
    }

    const subtotal = getCartSubtotal();
    if (found.minSpend && subtotal < found.minSpend) {
      setPromoError(`Minimum spend of ₨ ${found.minSpend.toLocaleString()} required for code ${found.code}`);
      return false;
    }

    setActivePromo(found);
    return true;
  }, [availablePromos, getCartSubtotal]);

  const removePromoCode = useCallback(() => {
    setActivePromo(null);
    setPromoError(null);
  }, []);

  const getDiscountAmount = useCallback(() => {
    if (!activePromo) return 0;
    const subtotal = getCartSubtotal();
    if (activePromo.type === 'percentage') {
      return Math.round((subtotal * activePromo.value) / 100);
    }
    if (activePromo.type === 'fixed') {
      return Math.min(subtotal, activePromo.value);
    }
    return 0;
  }, [activePromo, getCartSubtotal]);

  const getShippingFee = useCallback(() => {
    if (cart.length === 0) return 0;
    if (activePromo?.type === 'free_shipping') return 0;
    const subtotal = getCartSubtotal();
    return subtotal > 15000 ? 0 : 250; // Free delivery over 15k PKR
  }, [cart, activePromo, getCartSubtotal]);

  const getCartTotal = useCallback(() => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const shipping = getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  }, [getCartSubtotal, getDiscountAmount, getShippingFee]);

  const getCartItemsCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const placeOrder = useCallback((orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    // Decrement stock for each cart item
    setProducts(prev => prev.map(p => {
      const cartItem = orderData.items.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    // Tracking & courier are assigned later (when shipped)
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `PK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [clearCart]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, courier?: CourierName, trackingNumber?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated: Partial<Order> = { status };

          // Assign default courier if shipping
          if ((status === 'shipped' || status === 'processing') && !courier && !ord.courier) {
            updated.courier = 'TCS Express';
          } else if (courier) {
            updated.courier = courier;
          }

          // Generate tracking number only when shipped, and only if not already set
          if (status === 'shipped' && !trackingNumber && !ord.trackingNumber) {
            updated.trackingNumber = `TCS-${Math.floor(100000000 + Math.random() * 900000000)}`;
          } else if (trackingNumber) {
            updated.trackingNumber = trackingNumber;
          }

          // If shipped and has no courier, auto-assign TCS Express
          if (status === 'shipped' && !updated.courier && !ord.courier) {
            updated.courier = 'TCS Express';
          }

          return { ...ord, ...updated };
        }
        return ord;
      })
    );
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    // Restore stock for the deleted order
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setProducts(prev => prev.map(p => {
        const cartItem = order.items.find(item => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock + cartItem.quantity };
        }
        return p;
      }));
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, [orders]);

  const importProducts = useCallback((newProducts: Product[]) => {
    setProducts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      // Merge: update existing, add new
      const merged = prev.map(p => {
        const incoming = newProducts.find(np => np.id === p.id);
        return incoming ? { ...p, ...incoming } : p;
      });
      const added = newProducts.filter(np => !existingIds.has(np.id));
      return [...merged, ...added];
    });
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        user,
        orders,
        activePromo,
        promoError,
        availablePromos,
        isCartOpen,
        isAuthModalOpen,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        setIsCartOpen,
        setIsAuthModalOpen,
        wishlist,
        recentlyViewed,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        setUser,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        getStock,
        importProducts,
        updateProduct,
        deleteProduct,
        addProduct,
        getCartSubtotal,
        getDiscountAmount,
        getShippingFee,
        getCartTotal,
        getCartItemsCount,
        toggleWishlist,
        isInWishlist,
        trackRecentlyViewed,
        dismissToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
