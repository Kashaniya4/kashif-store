'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Check, Truck } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 15000;

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
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

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getCartTotal();

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-600/40">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our premium products and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-50 font-bold text-xs hover:bg-emerald-400 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-xl bg-white/60 border border-slate-200 items-center justify-between"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      ₨ {item.product.price.toLocaleString()} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-emerald-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        ₨ {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Promo Code & Order Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-white/80 space-y-4">

              {/* Free Shipping Progress */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  {freeShippingRemaining > 0 ? (
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Add <strong className="text-emerald-600">₨ {freeShippingRemaining.toLocaleString()}</strong> more for FREE shipping
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      You&apos;ve unlocked FREE nationwide shipping! 🎉
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Promo code input */}
              <div>
                {activePromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-700">{activePromo.code} Applied</span>
                      <span className="text-slate-600">({activePromo.description})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Promo Code (WELCOME10)"
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-lg py-2 pl-8 pr-3 border border-slate-300 focus:outline-none focus:border-emerald-500"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-emerald-600 font-bold text-xs rounded-lg border border-slate-300 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoError}</p>
                )}
              </div>

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-800">₨ {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Promo Discount</span>
                    <span>- ₨ {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Nationwide Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-slate-800'}>
                    {shipping === 0 ? 'FREE' : `₨ ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-600">₨ {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-50 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
