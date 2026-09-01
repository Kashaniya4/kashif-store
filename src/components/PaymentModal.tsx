'use client';

import React, { useState } from 'react';
import { PaymentMethod, CustomerDetails, Order } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Copy, 
  Check, 
  QrCode,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: CustomerDetails;
  onOrderSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  customerDetails,
  onOrderSuccess
}) => {
  const { cart, activePromo, placeOrder, getCartSubtotal, getDiscountAmount, getShippingFee, getCartTotal } = useStore();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('jazzcash');
  const [accountNumber, setAccountNumber] = useState('03001234567');
  const [txnProofId, setTxnProofId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const totalPayable = getCartTotal();

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText('PK82SASTA00019283746501');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') {
      if (!accountNumber || accountNumber.length < 11) {
        setErrorMessage('Please enter a valid 11-digit Pakistani mobile wallet number.');
        return;
      }
    }

    if (selectedMethod === 'sadapay' || selectedMethod === 'nayapay') {
      if (!accountNumber) {
        setErrorMessage('Please enter your SadaPay / NayaPay username or card number.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment gateway API latency
    setTimeout(() => {
      setIsProcessing(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if window unavailable
      }

      const paymentStatusMap: Record<PaymentMethod, 'paid' | 'unpaid' | 'pending_verification'> = {
        jazzcash: 'paid',
        easypaisa: 'paid',
        sadapay: 'paid',
        nayapay: 'paid',
        card: 'paid',
        cod: 'unpaid',
        bank_transfer: 'pending_verification'
      };

      const newOrder = placeOrder({
        items: cart,
        customer: customerDetails,
        subtotal: getCartSubtotal(),
        discount: getDiscountAmount(),
        shippingFee: getShippingFee(),
        total: totalPayable,
        paymentMethod: selectedMethod,
        paymentStatus: paymentStatusMap[selectedMethod],
        transactionId: txnProofId || `TXN-PK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        promoCodeApplied: activePromo?.code
      });

      // Fire order confirmation email (non-blocking, graceful failure).
      // No-op if no email address or RESEND_API_KEY missing.
      void fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json().catch(() => null);
            console.warn('[order-email] send failed:', err?.error || res.statusText);
          }
        })
        .catch((err) => console.warn('[order-email] network error:', err));

      onOrderSuccess(newOrder);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              Pakistani Payment Gateway
            </span>
            <h3 className="text-xl font-black text-slate-900">Select Payment Method</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-600/40 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-600 font-medium">Total Amount Due</div>
            <div className="text-2xl font-black text-emerald-600">
              ₨ {totalPayable.toLocaleString()}
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>Customer: <strong className="text-slate-900">{customerDetails.fullName}</strong></div>
            <div>City: <strong className="text-slate-900">{customerDetails.city}</strong></div>
          </div>
        </div>

        {/* Gateway Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
          {/* JazzCash */}
          <button
            type="button"
            onClick={() => setSelectedMethod('jazzcash')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'jazzcash'
                ? 'bg-rose-50/60 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-rose-600">JazzCash</span>
              <Smartphone className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-[10px] text-slate-600">Mobile Wallet & QR</span>
          </button>

          {/* EasyPaisa */}
          <button
            type="button"
            onClick={() => setSelectedMethod('easypaisa')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'easypaisa'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-emerald-600">EasyPaisa</span>
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] text-slate-600">Instant Wallet Transfer</span>
          </button>

          {/* SadaPay / NayaPay */}
          <button
            type="button"
            onClick={() => setSelectedMethod('sadapay')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'sadapay'
                ? 'bg-teal-950/60 border-teal-500 text-teal-300 ring-2 ring-teal-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-teal-300">SadaPay / Naya</span>
              <CreditCard className="w-4 h-4 text-teal-300" />
            </div>
            <span className="text-[10px] text-slate-600">Virtual Debit Card</span>
          </button>

          {/* Cash on Delivery */}
          <button
            type="button"
            onClick={() => setSelectedMethod('cod')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'cod'
                ? 'bg-amber-950/60 border-amber-500 text-amber-600 ring-2 ring-amber-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-amber-600">COD</span>
              <Banknote className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[10px] text-slate-600">Cash on Delivery</span>
          </button>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setSelectedMethod('bank_transfer')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'bank_transfer'
                ? 'bg-sky-950/60 border-sky-500 text-sky-300 ring-2 ring-sky-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-sky-300">Bank IBAN</span>
              <Building2 className="w-4 h-4 text-sky-300" />
            </div>
            <span className="text-[10px] text-slate-600">Direct Account</span>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedMethod === 'card'
                ? 'bg-purple-950/60 border-purple-500 text-purple-300 ring-2 ring-purple-500/30'
                : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-purple-300">Visa / MC</span>
              <CreditCard className="w-4 h-4 text-purple-300" />
            </div>
            <span className="text-[10px] text-slate-600">Credit / Debit Card</span>
          </button>

        </div>

        {/* Dynamic Payment Details & Inputs */}
        <form onSubmit={handleProcessPayment} className="space-y-4 overflow-x-auto">
          
          {(selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Enter {selectedMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Account Mobile Number</span>
              </div>
              <input
                type="tel"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="03001234567"
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-600">
                A prompt will appear on your phone screen to enter your MPIN and confirm payment of ₨ {totalPayable.toLocaleString()}.
              </p>
            </div>
          )}

          {selectedMethod === 'sadapay' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CreditCard className="w-4 h-4 text-teal-300" />
                <span>SadaPay / NayaPay Username or Number</span>
              </div>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="@username or 03001234567"
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl py-3 px-4 border border-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          )}

          {selectedMethod === 'bank_transfer' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800">sastamaal.net Official Bank Account Details</div>
              <div className="space-y-1 text-slate-700 font-mono bg-white p-3 rounded-xl border border-slate-200">
                <div>Bank: <strong className="text-slate-900">Meezan Bank Limited</strong></div>
                <div>Account Title: <strong className="text-slate-900">Sastamaal E-Commerce</strong></div>
                <div className="flex items-center justify-between pt-1">
                  <span>IBAN: <strong className="text-emerald-600">PK82SASTA00019283746501</strong></span>
                  <button
                    type="button"
                    onClick={handleCopyIBAN}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Transaction ID / Reference (Optional)</label>
                <input
                  type="text"
                  value={txnProofId}
                  onChange={e => setTxnProofId(e.target.value)}
                  placeholder="e.g. FT2608821903"
                  className="w-full bg-white text-slate-900 text-xs rounded-xl py-3 px-4 border border-slate-200"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'cod' && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-2">
              <div className="font-bold text-amber-600 flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery Confirmation</span>
              </div>
              <p className="text-slate-700">
                You will pay <strong className="text-amber-700">₨ {totalPayable.toLocaleString()}</strong> in cash to the rider upon delivery at your doorstep ({customerDetails.city}).
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <input
                type="text"
                placeholder="Cardholder Name"
                defaultValue={customerDetails.fullName}
                className="w-full bg-white text-slate-900 rounded-xl py-3 px-4 border border-slate-200"
              />
              <input
                type="text"
                placeholder="Card Number (4000 ...)"
                defaultValue="4242 •••• •••• 4242"
                className="w-full bg-white text-slate-900 rounded-xl py-3 px-4 border border-slate-200 font-mono"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM / YY"
                  defaultValue="12 / 28"
                  className="bg-white text-slate-900 rounded-xl py-3 px-4 border border-slate-200 font-mono"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  defaultValue="123"
                  className="bg-white text-slate-900 rounded-xl py-3 px-4 border border-slate-200 font-mono"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-50 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₨ {totalPayable.toLocaleString()} & Complete Order</span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            256-bit SSL Bank Grade Encryption • Official Pakistani Gateway Simulator
          </p>

        </form>

      </div>
    </div>
  );
};
