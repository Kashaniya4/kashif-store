'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { PaymentModal } from '@/components/PaymentModal';
import { CustomerDetails, Order } from '@/types/store';
import { 
  ShoppingBag, 
  Tag, 
  Truck, 
  ShieldCheck, 
  User as UserIcon, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft,
  CreditCard,
  Printer,
  ShieldAlert
} from 'lucide-react';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur'
];

export default function CheckoutPage() {
  const {
    cart,
    user,
    setIsAuthModalOpen,
    activePromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    getCartSubtotal,
    getDiscountAmount,
    getShippingFee,
    getCartTotal
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState('');

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '03001234567',
    city: 'Lahore',
    address: 'Street 5, DHA Phase 3',
    isGuest: !user
  });

  useLayoutEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email,
        phone: user.phone || prev.phone,
        isGuest: false
      }));
    }
  }, [user]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
    }
  };

  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customer.fullName || !customer.phone || !customer.address) {
      setFormError('Please fill in all required shipping details before proceeding.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-slate-100 space-y-8">
        
        {/* Success Card */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
            Order Placed Successfully
          </span>

          <h1 className="text-3xl font-black text-white">
            Thank You, {placedOrder.customer.fullName}!
          </h1>

          <p className="text-xs text-slate-400">
            Order Reference: <strong className="text-emerald-400 font-mono">{placedOrder.orderNumber}</strong> • Status: <strong className="text-amber-300 capitalize">{placedOrder.status}</strong>
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between font-bold text-white pb-2 border-b border-slate-800">
              <span>Fulfillment Courier</span>
              <span className="text-emerald-400">{placedOrder.courier} ({placedOrder.trackingNumber})</span>
            </div>
            <div>Payment Gateway: <strong className="text-white uppercase">{placedOrder.paymentMethod}</strong></div>
            <div>Delivery Address: <strong className="text-white">{placedOrder.customer.address}, {placedOrder.customer.city}</strong></div>
            <div>Contact Phone: <strong className="text-white">{placedOrder.customer.phone}</strong></div>
            <div>Total Paid: <strong className="text-emerald-400">₨ {placedOrder.total.toLocaleString()}</strong></div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Receipt</span>
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>View in Logistics Admin Portal</span>
            </Link>
          </div>

        </div>

      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Add products to your cart before proceeding to checkout.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getCartTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Secure Order</span>
          <h1 className="text-3xl font-black text-white">Checkout & Shipping</h1>
        </div>
        <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Auth Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {user ? `Logged in as ${user.name}` : 'Checking out as Guest'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {user ? user.email : 'You can checkout instantly without password'}
                </div>
              </div>
            </div>
            {!user && (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition"
              >
                Social Login
              </button>
            )}
          </div>

          {/* Form */}
          <form id="checkout-form" onSubmit={handleOpenPayment} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Shipping & Delivery Information (Pakistan)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saad Mansoor"
                    value={customer.fullName}
                    onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pakistani Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="saad@example.pk"
                    value={customer.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select City *</label>
                <select
                  value={customer.city}
                  onChange={e => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl py-2.5 px-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {PAKISTANI_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Complete Street Address *</label>
              <div className="relative">
                <textarea
                  required
                  rows={3}
                  placeholder="House / Apartment #, Street Name, Sector/Block, Landmark"
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          </form>

        </div>

        {/* Right Column: Cart Overview, Promo Code & Payment Button */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Order Items ({cart.length})</span>
              <span className="text-xs text-emerald-400 font-mono">₨ {subtotal.toLocaleString()}</span>
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover bg-slate-950" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{item.product.name}</div>
                    <div className="text-slate-400">Qty: {item.quantity} × ₨ {item.product.price.toLocaleString()}</div>
                  </div>
                  <div className="font-bold text-white">
                    ₨ {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Engine Box */}
            <div className="pt-4 border-t border-slate-800">
              {activePromo ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-300">{activePromo.code}</span>
                      <span className="block text-[10px] text-slate-400">{activePromo.description}</span>
                    </div>
                  </div>
                  <button onClick={removePromoCode} className="text-rose-400 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code (WELCOME10)"
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    className="flex-1 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2 px-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{promoError}</p>
              )}
            </div>

            {/* Total Calculations */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">₨ {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Code Savings</span>
                  <span>- ₨ {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping Nationwide</span>
                <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : `₨ ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">₨ {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              form="checkout-form"
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition"
            >
              <CreditCard className="w-5 h-5" />
              <span>Select Pakistani Gateway & Pay</span>
            </button>

          </div>

        </div>

      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerDetails={customer}
        onOrderSuccess={(ord) => setPlacedOrder(ord)}
      />

    </div>
  );
}
