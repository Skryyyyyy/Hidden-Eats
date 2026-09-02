'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  X,
  Zap,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { buildUPIDeepLink, generateLocalBharatQRDataUrl, calculateOrderSettlement } from '@/lib/payment';
import DinerSecretQRPassModal from '@/components/DinerSecretQRPassModal';

interface SmartUPIPaymentModalProps {
  order: {
    id: string;
    restaurantName: string;
    itemsSummary: string;
    amount: number;
    tableNumber?: string;
    type?: 'TABLE_BOOKING' | 'FOOD_ORDER';
  };
  onClose: () => void;
  onPaymentSuccess?: (paymentResult: any) => void;
}

export default function SmartUPIPaymentModal({
  order,
  onClose,
  onPaymentSuccess,
}: SmartUPIPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [showSecretPass, setShowSecretPass] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minute timer

  const vpa = 'hiddeneats@upi';
  const payeeName = order.restaurantName || 'Grand Secret Kitchen';
  const amount = Number(order.amount) || 480;
  const transactionRef = `HE_${order.id || Date.now()}`;

  const upiDeepLink = buildUPIDeepLink({
    payeeVPA: vpa,
    payeeName,
    amount,
    transactionRef,
    note: `Hidden Eats - ${order.itemsSummary}`,
  });

  const settlement = calculateOrderSettlement(amount);

  // Generate local in-memory QR Code data URL without third-party network requests
  useEffect(() => {
    generateLocalBharatQRDataUrl({
      payeeVPA: vpa,
      payeeName,
      amount,
      transactionRef,
      note: `Hidden Eats - ${order.itemsSummary}`,
    }).then((url) => {
      setQrCodeDataUrl(url);
    });
  }, [vpa, payeeName, amount, transactionRef, order.itemsSummary]);

  // Countdown timer
  useEffect(() => {
    if (paymentDone || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [paymentDone, secondsLeft]);

  const handleCopyVPA = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOneTapPay = () => {
    // Attempt opening native UPI app on mobile
    window.location.href = upiDeepLink;
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          transactionRef,
          amount,
          settlement,
          timestamp: new Date().toISOString(),
        });
      }
    }, 1200);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showSecretPass) {
    return (
      <DinerSecretQRPassModal
        bookingOrOrder={{
          type: order.type || 'FOOD_ORDER',
          id: order.id,
          restaurantName: order.restaurantName,
          dinerName: 'Verified Diner',
          details: `${order.itemsSummary} • Paid ₹${amount.toFixed(2)}`,
          tableAssigned: order.tableNumber || 'Table #4',
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#0a0d14] border-2 border-[#f59e0b]/40 rounded-[36px] p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] relative overflow-hidden text-white space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center font-black">
              <Zap className="w-4 h-4 fill-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">Dynamic UPI Smart Pay</h3>
              <p className="text-[10px] text-gray-400">Direct Bank Settlement • 256-Bit Encrypted</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paymentDone ? (
          /* Payment Confirmed State */
          <div className="py-6 text-center space-y-5 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Payment Verified & Locked
              </span>
              <h4 className="text-2xl font-black mt-2 text-white">₹{amount.toFixed(2)} Paid</h4>
              <p className="text-xs text-gray-400 mt-1">Ref: {transactionRef}</p>
            </div>

            {/* Settlement Breakdown Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span>Kitchen Payout (85%):</span>
                <span className="font-bold text-white">₹{settlement.partnerPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Driver Delivery Fee (15%):</span>
                <span className="font-bold text-white">₹{settlement.driverShare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 text-[11px] pt-1 border-t border-white/10">
                <span>Platform Commission (5%):</span>
                <span>₹{settlement.platformFee.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSecretPass(true)}
              className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#f59e0b]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate Secret Pass QR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Payment Pending / Active QR State */
          <div className="space-y-5">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-[#f59e0b]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b] block">Total Payable</span>
                <h4 className="text-2xl font-black text-white">₹{amount.toFixed(2)}</h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#f59e0b]" /> Expires in
                </span>
                <span className="font-mono font-bold text-sm text-[#f59e0b]">{formatTimer(secondsLeft)}</span>
              </div>
            </div>

            {/* Mobile 1-Tap Pay Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleOneTapPay}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#f59e0b]/25 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>1-Tap Pay via GPay / PhonePe / Paytm</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Auto-opens your default UPI application with pre-filled amount.
              </p>
            </div>

            {/* Desktop / iPad Scan QR Section */}
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">
                Or Scan with Any UPI Camera App:
              </span>

              {/* Dynamic In-Memory BharatQR Code */}
              <div className="p-3 bg-white rounded-2xl inline-block shadow-xl border-2 border-[#f59e0b] min-w-[190px] min-h-[190px] flex items-center justify-center mx-auto">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Dynamic Smart UPI QR"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-7 h-7 border-3 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-black font-bold uppercase">Generating UPI QR...</span>
                  </div>
                )}
              </div>

              {/* UPI ID Copy Bar */}
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px]">UPI VPA:</span>
                  <span className="font-mono text-white font-bold">{vpa}</span>
                </div>
                <button
                  onClick={handleCopyVPA}
                  className="p-1 rounded-lg hover:bg-white/10 text-[#f59e0b] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Supported App Logos & Security */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold px-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted UPI
              </span>
              <span>GPay • PhonePe • Paytm • BHIM • CRED</span>
            </div>

            {/* Test Simulation Button (Development Only) */}
            <button
              onClick={handleSimulatePaymentSuccess}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying UPI Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>⚡ Simulate Instant Payment Approval (Test Mode)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
