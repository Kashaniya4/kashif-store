'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { OrderStatus, CourierName, Order } from '@/types/store';
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
  LogOut
} from 'lucide-react';

const COURIER_OPTIONS: CourierName[] = [
  'TCS Express',
  'Leopards Courier',
  'Trax Logistics',
  'PostEx',
  'CallCourier'
];

export default function AdminLogisticsPage() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

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
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="bg-sky-950/80 text-sky-300 border border-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Processing</span>;
      case 'shipped':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'delivered':
        return <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  // Auth screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white">Logistics Admin</h1>
            <p className="text-xs text-slate-400">
              Enter admin password to access orders & dispatch panel.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Security Password *</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full bg-slate-950 text-white placeholder-slate-600 text-xs rounded-xl py-3 px-4 border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20"
            >
              Verify Credentials
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-emerald-400 transition">
              ← Return to Store Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Store</span>
          </Link>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Truck className="w-8 h-8 text-emerald-400" />
            <span>Pakistani Logistics & Order Backend</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming store orders, assign TCS/Leopards/Trax couriers, generate tracking numbers & print tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/json-importer"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Manage JSON Products</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-900 text-xs font-bold flex items-center gap-2 transition"
            title="Logout Admin"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logistics Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Received Revenue (Paid)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₨ {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500">Collected via Mobile Wallets & Cards</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Orders Placed</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500">Active Customer Purchases</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {pendingOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500">Needs courier assignment</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Shipped / Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {shippedOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500">In Transit or Handed over</p>
        </div>

      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setSelectedFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition whitespace-nowrap ${
                selectedFilter === st
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search Order #, City, Phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Truck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No received orders found</h3>
            <p className="text-xs text-slate-400">Place a new test order from the checkout page to see it live here!</p>
            <Link href="/checkout" className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
              Go to Checkout
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition space-y-6 shadow-lg"
            >
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white font-mono">{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Payment Gateway: <strong className="text-emerald-400 uppercase font-mono">{order.paymentMethod}</strong></span>
                    <span>•</span>
                    <span>Payment Status: <strong className={order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}>{order.paymentStatus}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                
                {/* Customer Details */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                  <div className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Customer Details</span>
                  </div>
                  <div className="text-slate-300">Name: <strong className="text-white">{order.customer.fullName}</strong></div>
                  <div className="text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{order.customer.phone}</span>
                  </div>
                  <div className="text-slate-300 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.customer.address}, <strong>{order.customer.city}</strong></span>
                  </div>
                </div>

                {/* Items & Amount */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                  <div className="font-bold text-white border-b border-slate-800 pb-2 flex justify-between">
                    <span>Order Items</span>
                    <span className="text-emerald-400">Total: ₨ {order.total.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {order.items.map(it => (
                      <div key={it.product.id} className="flex justify-between text-slate-300">
                        <span className="truncate max-w-[170px]">{it.product.name}</span>
                        <span className="font-mono">x{it.quantity} (₨ {(it.product.price * it.quantity).toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courier & Tracking Control */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                  <div className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Logistics & Courier Action</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assigned Pakistani Courier</label>
                    <select
                      value={order.courier || 'TCS Express'}
                      onChange={e => updateOrderStatus(order.id, order.status, e.target.value as CourierName, order.trackingNumber)}
                      className="w-full bg-slate-900 text-white text-xs rounded-xl py-1.5 px-2.5 border border-slate-800"
                    >
                      {COURIER_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Update Status Pipeline</label>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus, order.courier, order.trackingNumber)}
                      className="w-full bg-slate-900 text-emerald-400 font-bold text-xs rounded-xl py-1.5 px-2.5 border border-slate-800"
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

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
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
                  <h2 className="text-2xl font-black text-slate-900">BAZAAR.PK</h2>
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
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2"
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
