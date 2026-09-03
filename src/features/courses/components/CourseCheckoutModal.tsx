import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, CheckCircle2, ShieldCheck, CreditCard, Lock, 
  Sparkles, Loader2, ArrowRight, Tag, AlertCircle
} from 'lucide-react';
import type { Course, PaymentCheckoutPayload, PaymentReceipt } from '@/services/api/types/api';
import { processCoursePayment } from '@/services/api/coursesApi';

interface CourseCheckoutModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: PaymentReceipt) => void;
}

export default function CourseCheckoutModal({
  course,
  isOpen,
  onClose,
  onSuccess,
}: CourseCheckoutModalProps) {
  const navigate = useNavigate();
  const isFreeCourse = (course.price === 0 || course.isFree);
  const basePrice = course.discountPrice !== undefined && course.discountPrice > 0 
    ? course.discountPrice 
    : (course.price || 0);

  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay' | 'paypal' | 'free_enrollment'>(
    isFreeCourse ? 'free_enrollment' : 'credit_card'
  );

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate final amount
  const discountMultiplier = discountApplied ? (100 - discountApplied.percent) / 100 : 1;
  const finalPrice = isFreeCourse ? 0 : Number((basePrice * discountMultiplier).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'LUMINA50' || code === 'SAVE50') {
      setDiscountApplied({ code, percent: 50 });
    } else if (code === 'FREE100' || code === 'STUDENT100') {
      setDiscountApplied({ code, percent: 100 });
    } else if (code === 'WELCOME20') {
      setDiscountApplied({ code, percent: 20 });
    } else {
      setPromoError('Invalid promo code. Try LUMINA50 or WELCOME20.');
    }
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 3) {
      return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    return clean;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      const payload: PaymentCheckoutPayload = {
        courseId: course.courseId,
        paymentMethod,
        cardholderName: cardName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate: cardExpiry,
        cvc: cardCvc,
        discountCode: discountApplied?.code,
        amountPaid: finalPrice,
        currency: 'INR',
      };

      const result = await processCoursePayment(payload);
      setReceipt(result);
      onSuccess(result);
    } catch (err: any) {
      setError(err?.message || 'Payment authorization failed. Please verify your details and try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-slate-100 my-8 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {isFreeCourse || finalPrice === 0 ? 'Course Enrollment' : 'Secure Checkout'}
              </h2>
              <p className="text-xs text-slate-400">
                {isFreeCourse || finalPrice === 0 ? 'Instant free access to all curriculum modules' : '256-bit SSL encrypted transaction'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {receipt ? (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-100">Enrollment Successful!</h3>
              <p className="text-sm text-slate-400 mt-1">
                You now have full access to <span className="text-sky-400 font-semibold">{course.title}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-slate-200">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-slate-200">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-400">₹{(receipt.amount || 0).toFixed(2)} INR</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-slate-200">{new Date(receipt.paidAt).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/student/courses/${course.courseId}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition"
            >
              Start Learning Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Course Summary Card */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-start gap-4">
              {course.thumbnailUrl ? (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-20 h-16 rounded-xl object-cover border border-border shrink-0" 
                />
              ) : (
                <img 
                  src="/IMG-20260825-WA6378.jpg" 
                  alt={course.title} 
                  className="w-20 h-16 rounded-xl object-cover border border-border shrink-0" 
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {course.level || 'All Levels'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {course.sections?.length || 0} Sections
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-200 line-clamp-1 mt-1">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instructor: {course.instructorName || 'Lead Educator'}
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector (For Paid Courses) */}
            {!isFreeCourse && finalPrice > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition ${
                      paymentMethod === 'credit_card'
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold mb-1">Pay</span>
                    Apple / G-Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition ${
                      paymentMethod === 'paypal'
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-indigo-400 mb-1">PP</span>
                    PayPal
                  </button>
                </div>
              </div>
            )}

            {/* Credit Card Inputs */}
            {!isFreeCourse && finalPrice > 0 && paymentMethod === 'credit_card' && (
              <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-sky-500 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-sky-500 font-mono transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-sky-500 font-mono transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Security Code (CVC)</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        maxLength={4}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-sky-500 font-mono transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Promo Code Input (For Paid Courses) */}
            {!isFreeCourse && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Have a Promo Code?</span>
                  <span className="text-[10px] text-sky-400 font-normal">Try LUMINA50</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Enter promo or student code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-slate-200 uppercase outline-none focus:border-sky-500 transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                {discountApplied && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Promo applied: {discountApplied.percent}% discount!
                  </p>
                )}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Original Price</span>
                <span className={course.discountPrice ? 'line-through text-slate-500' : 'text-slate-200'}>
                  {(course.price || 0) === 0 ? 'Free' : `₹${(course.price || 0).toFixed(2)}`}
                </span>
              </div>
              {course.discountPrice !== undefined && course.discountPrice > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Special Early-Bird Price</span>
                  <span>₹{course.discountPrice.toFixed(2)}</span>
                </div>
              )}
              {discountApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({discountApplied.code})</span>
                  <span>-{discountApplied.percent}%</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Taxes & Fees</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-100">
                <span>Total Due</span>
                <span className="text-emerald-400 text-base">
                  {finalPrice === 0 ? 'Free (₹0.00)' : `₹${finalPrice.toFixed(2)} INR`}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 disabled:opacity-50 transition"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authorizing Payment...
                </>
              ) : isFreeCourse || finalPrice === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Enroll for Free Now
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay ₹{finalPrice.toFixed(2)} & Enroll
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
