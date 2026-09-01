'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { OrderStatus, CourierName, Order, Product } from '@/types/store';
import {
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  Search,
  TrendingUp,
  DollarSign,
  User,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
  X,
  ExternalLink,
  Trash2,
  LogOut,
  BarChart2,
  ShoppingCart,
  Box,
  AlertCircle,
  AlertOctagon,
  PlusCircle,
  Edit,
  Trash,
  Settings,
  Package,
  DollarSign as DollarSignIcon,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const COURIER_OPTIONS: CourierName[] = [
  'TCS Express',
  'Leopards Courier',
  'Trax Logistics',
  'PostEx',
  'CallCourier'
];

export default function AdminDashboard() {
  const {
    products,
    orders,
    updateOrderStatus,
    deleteOrder,
    updateProduct,
    deleteProduct,
    addProduct,
    getCartSubtotal,
    getCartTotal,
    getDiscountAmount,
    getShippingFee
  } = useStore();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'analytics'>('orders');
  const [productEditId, setProductEditId] = useState<string | null>(null);
  const [productEditData, setProductEditData] = useState<Product | null>(null);
  const [newProductData, setNewProductData] = useState<Product>({} as Product);

  // Check authentication on mount
  useEffect(() => {
    try {
      const isAuth = sessionStorage.getItem('pk_store_admin_auth') === 'true';
      if (isAuth) setIsAdminAuthenticated(true);
    } catch (e) { /* ignore */ }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Default admin credentials
    const targetPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (passwordInput === targetPassword) {
      try {
        sessionStorage.setItem('pk_store_admin_auth', 'true');
      } catch (e) { /* ignore */ }
      setIsAdminAuthenticated(true);
    } else {
      setAuthError('Incorrect administrator password. Access denied.');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('pk_store_admin_auth');
    } catch (e) { /* ignore */ }
    setIsAdminAuthenticated(false);
    setPasswordInput('');
  };

  // Revenue & Logistics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.paymentStatus === 'paid' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;

  const filteredOrders = orders.filter(ord => {
    const matchesFilter = selectedFilter === 'all' || ord.status === selectedFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.phone.includes(searchQuery) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-600 border border-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="bg-sky-100 text-sky-300 border border-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Processing</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-300 border border-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-50/80 text-rose-300 border border-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  // Auth screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-600/40 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Logistics Admin</h1>
            <p className="text-xs text-slate-600">
              Enter admin password to access orders & dispatch panel.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Password *</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20"
            >
              Verify Credentials
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-600 transition">
              ← Return to Store Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Products counts
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Analytics stats
  const totalSalesAll = orders.reduce((sum, ord) => sum + ord.total, 0);
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesAll / totalOrdersCount) : 0;

  // Category statistics
  const categorySales = orders.reduce((acc, ord) => {
    ord.items.forEach(it => {
      acc[it.product.category] = (acc[it.product.category] || 0) + (it.product.price * it.quantity);
    });
    return acc;
  }, {} as Record<string, number>);

  // Payment method statistics
  const paymentStats = orders.reduce((acc, ord) => {
    acc[ord.paymentMethod] = (acc[ord.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top products
  const productSalesCount = orders.reduce((acc, ord) => {
    ord.items.forEach(it => {
      acc[it.product.name] = (acc[it.product.name] || 0) + it.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSalesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleUpdateProductStock = (id: string, newStock: number) => {
    updateProduct(id, { stock: Math.max(0, newStock) });
  };

  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    updateProduct(id, { price: Math.max(0, newPrice) });
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productEditId && productEditData) {
      updateProduct(productEditId, productEditData);
      setProductEditId(null);
      setProductEditData(null);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductData.name && newProductData.price) {
      const id = `prod-${Date.now()}`;
      const slug = newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const finalProduct: Product = {
        ...newProductData,
        id,
        slug,
        rating: 4.5,
        reviewsCount: 1,
        image: newProductData.image || "/products/Download/Quick Share/listed products/buds/BUDS.png",
        images: [newProductData.image || "/products/Download/Quick Share/listed products/buds/BUDS.png"],
        specs: newProductData.specs || { "Quality": "Standard" },
        tags: newProductData.tags || [newProductData.category]
      };
      addProduct(finalProduct);
      setNewProductData({} as Product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-600 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Store</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-600" />
            <span>SastaMaal Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage incoming orders, dispatch couriers, update products pricing/stock, and review sales analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/json-importer"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-600 border border-slate-300 text-xs font-bold flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Manage JSON Products</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-2 transition"
            title="Logout Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
                <span>Received Revenue (Paid)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">₨ {totalRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500">Collected via Mobile Wallets & Cards</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
                <span>Total Orders Placed</span>
                <PackageCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalOrdersCount}</div>
              <p className="text-[11px] text-slate-500">Active Customer Purchases</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
                <span>Low / Out of Stock</span>
                <AlertOctagon className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600">{lowStockProducts.length} Items</div>
              <p className="text-[11px] text-slate-500">Stock is 5 units or lower</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
                <span>Average Order Value</span>
                <DollarSignIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">₨ {averageOrderValue.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500">Average sales per customer basket</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Warnings */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-600" /> Low Stock Alerts</h3>
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-slate-600">All products have healthy stock levels.</p>
              ) : (
                <div className="divide-y divide-slate-200 max-h-60 overflow-y-auto pr-1">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center py-2.5 text-xs">
                      <span className="text-slate-700 font-semibold truncate max-w-[240px]">{p.name}</span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${p.stock === 0 ? 'bg-rose-50/80 text-rose-600 border border-rose-800' : 'bg-amber-100 text-amber-600 border border-amber-800'}`}>
                        {p.stock === 0 ? "Out of Stock" : `${p.stock} Left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-600" /> Best Sellers</h3>
              {topProducts.length === 0 ? (
                <p className="text-xs text-slate-600">No sales recorded yet to calculate best sellers.</p>
              ) : (
                <div className="divide-y divide-slate-200">
                  {topProducts.map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center py-2.5 text-xs">
                      <span className="text-slate-700 font-semibold truncate max-w-[240px]">{name}</span>
                      <span className="font-mono font-bold text-emerald-600">{count} units sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition whitespace-nowrap ${
                    selectedFilter === st
                      ? 'bg-emerald-500 text-slate-50 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search Order #, City, Phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white/40 rounded-3xl border border-slate-200 space-y-3">
                <Truck className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No received orders found</h3>
                <p className="text-xs text-slate-600">Place a new test order from the checkout page to see it live here!</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 transition space-y-6 shadow-lg"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900 font-mono">{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                        <span className="text-xs text-slate-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-2">
                        <span>Payment Gateway: <strong className="text-emerald-600 uppercase font-mono">{order.paymentMethod}</strong></span>
                        <span>•</span>
                        <span>Payment Status: <strong className={order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>{order.paymentStatus}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-300 flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Print Invoice</span>
                      </button>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    {/* Customer Details */}
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Customer Details</span>
                      </div>
                      <div className="text-slate-700">Name: <strong className="text-slate-900">{order.customer.fullName}</strong></div>
                      <div className="text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-600" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="text-slate-700 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                        <span>{order.customer.address}, <strong>{order.customer.city}</strong></span>
                      </div>
                    </div>

                    {/* Items & Amount */}
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex justify-between">
                        <span>Order Items</span>
                        <span className="text-emerald-600">Total: ₨ {order.total.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        {order.items.map(it => (
                          <div key={it.product.id} className="flex justify-between text-slate-700">
                            <span className="truncate max-w-[170px]">{it.product.name}</span>
                            <span className="font-mono">x{it.quantity} (₨ {(it.product.price * it.quantity).toLocaleString()})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courier & Tracking Control */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Logistics & Courier Action</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Assigned Pakistani Courier</label>
                        <select
                          value={order.courier || 'TCS Express'}
                          onChange={e => updateOrderStatus(order.id, order.status, e.target.value as CourierName, order.trackingNumber)}
                          className="w-full bg-white text-slate-900 text-xs rounded-xl py-1.5 px-2.5 border border-slate-200"
                        >
                          {COURIER_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Update Status Pipeline</label>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus, order.courier, order.trackingNumber)}
                          className="w-full bg-white text-emerald-600 font-bold text-xs rounded-xl py-1.5 px-2.5 border border-slate-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing & Packing</option>
                          <option value="shipped">Shipped via Courier</option>
                          <option value="delivered">Delivered to Customer</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Product Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><PlusCircle className="w-4 h-4 text-emerald-600" /> Add New Product</h3>
            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductData.name || ''}
                  onChange={e => setNewProductData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ronin Speaker"
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Price (₨) *</label>
                  <input
                    type="number"
                    required
                    value={newProductData.price || ''}
                    onChange={e => setNewProductData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="₨"
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Original Price (₨)</label>
                  <input
                    type="number"
                    value={newProductData.originalPrice || ''}
                    onChange={e => setNewProductData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    placeholder="₨"
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Category *</label>
                  <select
                    value={newProductData.category || ''}
                    onChange={e => setNewProductData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select...</option>
                    <option value="Electronics & Audio">Electronics & Audio</option>
                    <option value="Mobile Accessories">Mobile Accessories</option>
                    <option value="Smart Watches">Smart Watches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProductData.stock === undefined ? '' : newProductData.stock}
                    onChange={e => setNewProductData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    placeholder="Qty"
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={newProductData.image || ''}
                  onChange={e => setNewProductData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="/products/Download/..."
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Description *</label>
                <textarea
                  required
                  value={newProductData.description || ''}
                  onChange={e => setNewProductData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed specifications and highlights..."
                  rows={3}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:from-emerald-400 hover:to-teal-400 transition"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </form>
          </div>

          {/* Product Listing Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Package className="w-4 h-4 text-emerald-600" /> Product Inventory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/60 transition">
                      <td className="p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 relative shrink-0">
                          <Image src={p.image} alt={p.name} fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="font-semibold text-slate-900 truncate max-w-[140px]" title={p.name}>{p.name}</span>
                      </td>
                      <td className="p-3 text-slate-600">{p.category}</td>
                      <td className="p-3 text-right text-emerald-600 font-bold">
                        ₨ {p.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateProductStock(p.id, p.stock - 1)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className={`font-mono font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleUpdateProductStock(p.id, p.stock + 1)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setProductEditId(p.id);
                              setProductEditData({ ...p });
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 text-emerald-600 border border-slate-300 hover:bg-slate-200 transition"
                            title="Edit Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-50 text-rose-600 border border-slate-200 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Stats & Methods */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><DollarSignIcon className="w-4 h-4 text-emerald-600" /> Revenue & Payments</h3>

            <div className="space-y-4">
              <div>
                <span className="text-slate-600 text-xs font-semibold block mb-1">Gateway Popularity (Share)</span>
                <div className="space-y-2 text-xs">
                  {Object.entries(paymentStats).map(([method, count]) => (
                    <div key={method} className="space-y-1">
                      <div className="flex justify-between text-slate-700">
                        <span className="uppercase font-mono">{method}</span>
                        <span>{count} orders ({Math.round((count / totalOrdersCount) * 100)}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / totalOrdersCount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Sales Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-emerald-600" /> Category Breakdown</h3>
            <div className="space-y-4 text-xs">
              {Object.entries(categorySales).map(([cat, val]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{cat}</span>
                    <span className="font-mono">₨ {val.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(val / totalSalesAll) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> Pipeline Speed</h3>
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>Pending Orders</span>
                <span className="font-bold text-amber-600">{orders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>Packing & Processing</span>
                <span className="font-bold text-sky-600">{orders.filter(o => o.status === 'processing').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>Shipped in Transit</span>
                <span className="font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span>Delivered Successfully</span>
                <span className="font-bold text-emerald-600">{orders.filter(o => o.status === 'delivered').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Product Modal */}
      {productEditId && productEditData && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-xs">
            <button
              onClick={() => {
                setProductEditId(null);
                setProductEditData(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-black text-slate-900">Edit Product Details</h2>
            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div>
                <label className="block text-slate-600 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productEditData.name}
                  onChange={e => setProductEditData(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Price (₨)</label>
                  <input
                    type="number"
                    required
                    value={productEditData.price}
                    onChange={e => setProductEditData(prev => ({ ...prev!, price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Original Price (₨)</label>
                  <input
                    type="number"
                    value={productEditData.originalPrice || ''}
                    onChange={e => setProductEditData(prev => ({ ...prev!, originalPrice: Number(e.target.value) }))}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Category</label>
                  <select
                    value={productEditData.category}
                    onChange={e => setProductEditData(prev => ({ ...prev!, category: e.target.value }))}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Electronics & Audio">Electronics & Audio</option>
                    <option value="Mobile Accessories">Mobile Accessories</option>
                    <option value="Smart Watches">Smart Watches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={productEditData.stock}
                    onChange={e => setProductEditData(prev => ({ ...prev!, stock: Number(e.target.value) }))}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={productEditData.image}
                  onChange={e => setProductEditData(prev => ({ ...prev!, image: e.target.value }))}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 font-black uppercase tracking-wider hover:from-emerald-400 hover:to-teal-400 transition"
              >
                Save Product Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Print Document */}
            <div className="space-y-6">

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">SASTAMAAL.NET</h2>
                  <p className="text-xs text-slate-500">Official Tax Invoice & Order Receipt</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-emerald-600">{selectedInvoiceOrder.orderNumber}</div>
                  <div className="text-xs text-slate-500">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Shipping</div>
                  <div className="font-bold text-slate-900">{selectedInvoiceOrder.customer.fullName}</div>
                  <div>{selectedInvoiceOrder.customer.address}</div>
                  <div>{selectedInvoiceOrder.customer.city}, Pakistan</div>
                  <div>Phone: {selectedInvoiceOrder.customer.phone}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">Logistics Info</div>
                  <div>Courier: <strong>{selectedInvoiceOrder.courier}</strong></div>
                  <div>Tracking #: <strong>{selectedInvoiceOrder.trackingNumber}</strong></div>
                  <div>Payment Method: <strong className="uppercase">{selectedInvoiceOrder.paymentMethod}</strong></div>
                  <div>Status: <strong className="capitalize">{selectedInvoiceOrder.status}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 font-bold border-b">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedInvoiceOrder.items.map(it => (
                    <tr key={it.product.id}>
                      <td className="p-2 font-medium">{it.product.name}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2 text-right">₨ {it.product.price.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">₨ {(it.product.price * it.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right text-xs space-y-1 pt-2 border-t">
                <div>Subtotal: ₨ {selectedInvoiceOrder.subtotal.toLocaleString()}</div>
                {selectedInvoiceOrder.discount > 0 && <div>Discount: - ₨ {selectedInvoiceOrder.discount.toLocaleString()}</div>}
                <div>Shipping Fee: ₨ {selectedInvoiceOrder.shippingFee.toLocaleString()}</div>
                <div className="text-base font-black text-slate-900 pt-2 border-t">
                  Total Paid: ₨ {selectedInvoiceOrder.total.toLocaleString()}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
