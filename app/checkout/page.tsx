"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CreditCard, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { api } from '@/services/api';
import { clearCart } from '@/store/slices/cartSlice';
import { CouponInput } from './CouponInput';
import { DiscountSummary } from './DiscountSummary';
import type { Coupon, CouponValidationResponse } from '@/store/types';

type CheckoutForm = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'razorpay';
};

type RazorpayOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
};

type RazorpayVerificationResponse = {
  verified: boolean;
};

const initialForm: CheckoutForm = {
  fullName: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  paymentMethod: 'cod',
};

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (document.getElementById('razorpay-checkout-js')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(total);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const orderItems = useMemo(() => items.map((item) => ({ productId: item._id, quantity: item.quantity, price: item.price })), [items]);

  useEffect(() => {
    if (!appliedCoupon?.code || !couponCode.trim()) {
      setDiscountAmount(0);
      setFinalAmount(total);
      return;
    }

    const validateCurrentCoupon = async () => {
      try {
        const { data } = await api.post<CouponValidationResponse>('/coupons/validate', { code: couponCode, subtotal: total });
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        setFinalAmount(data.finalAmount);
        setCouponError(null);
      } catch (error: any) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setFinalAmount(total);
        setCouponError(error.response?.data?.message || 'Coupon is no longer valid.');
      }
    };

    void validateCurrentCoupon();
  }, [appliedCoupon?.code, couponCode, total]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter a coupon code to apply a discount.');
      return;
    }

    setCouponLoading(true);
    try {
      const { data } = await api.post<CouponValidationResponse>('/coupons/apply', { code: couponCode, subtotal: total });
      setAppliedCoupon(data.coupon);
      setDiscountAmount(data.discountAmount);
      setFinalAmount(data.finalAmount);
      setCouponError(null);
    } catch (error: any) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setFinalAmount(total);
      setCouponError(error.response?.data?.message || 'Unable to apply this coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFinalAmount(total);
    setCouponError(null);
  };

  const submitOrder = async (paymentOverrides: Partial<{
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentProvider: 'cod' | 'razorpay';
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }> = {}) => {
    await api.post('/orders', {
      products: orderItems,
      shippingAddress: {
        recipient: form.fullName,
        phone: form.phoneNumber,
        line1: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        country: 'India',
      },
      paymentMethod: form.paymentMethod,
      paymentStatus: paymentOverrides.paymentStatus ?? 'pending',
      paymentProvider: paymentOverrides.paymentProvider ?? form.paymentMethod,
      razorpayOrderId: paymentOverrides.razorpayOrderId ?? null,
      razorpayPaymentId: paymentOverrides.razorpayPaymentId ?? null,
      razorpaySignature: paymentOverrides.razorpaySignature ?? null,
      totalAmount: total,
      couponCode: appliedCoupon?.code ?? null,
      discountAmount,
      finalAmount,
    });

    dispatch(clearCart());
    router.push('/profile');
  };

  const placeCodOrder = async () => {
    setSubmitting(true);
    setPaymentError(null);
    try {
      await submitOrder({ paymentStatus: 'pending', paymentProvider: 'cod' });
    } catch (error: any) {
      setPaymentError(error?.response?.data?.message || 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const openRazorpayCheckout = async () => {
    setPaymentError(null);

    if (!razorpayKeyId) {
      setPaymentError('Razorpay test key is missing. Add NEXT_PUBLIC_RAZORPAY_KEY_ID first.');
      return;
    }

    if (!form.fullName || !form.phoneNumber || !form.address || !form.city || !form.state || !form.pincode) {
      setPaymentError('Please complete the shipping form before paying with Razorpay.');
      setStep(1);
      return;
    }

    setPaymentLoading(true);

    try {
      const { data } = await api.post<RazorpayOrderResponse>('/payments/razorpay/order', {
        amount: finalAmount,
        receipt: `aurelia_${Date.now()}`,
      });

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Unable to load Razorpay checkout.');

      const RazorpayCheckout = (window as Window & {
        Razorpay?: new (options: Record<string, unknown>) => {
          open: () => void;
          on: (event: string, handler: (response: any) => void) => void;
        };
      }).Razorpay;

      if (!RazorpayCheckout) throw new Error('Razorpay checkout is unavailable.');

      const razorpay = new RazorpayCheckout({
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Aurelia',
        description: 'Luxury perfume checkout',
        order_id: data.orderId,
        prefill: {
          name: form.fullName,
          contact: form.phoneNumber,
        },
        theme: { color: '#b7934e' },
        handler: async (response: any) => {
          try {
            setPaymentLoading(true);
            await api.post<RazorpayVerificationResponse>('/payments/razorpay/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            await submitOrder({
              paymentStatus: 'paid',
              paymentProvider: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (error: any) {
            setPaymentError(error?.response?.data?.message || 'Payment verification failed.');
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });

      razorpay.on('payment.failed', (response: any) => {
        setPaymentLoading(false);
        setPaymentError(response?.error?.description || 'Payment was not completed.');
      });

      razorpay.open();
    } catch (error: any) {
      setPaymentLoading(false);
      setPaymentError(error?.message || 'Unable to start Razorpay checkout.');
    }
  };

  const placeOrder = async () => {
    if (form.paymentMethod === 'razorpay') {
      await openRazorpayCheckout();
      return;
    }

    await placeCodOrder();
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-ink dark:text-white md:grid-cols-[1fr_340px]">
      <div>
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 font-serif text-4xl">Complete your ritual</h1>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
          {['Shipping', 'Payment', 'Review', 'Place order'].map((label, index) => (
            <button key={label} onClick={() => setStep(index + 1)} className={`rounded-full border px-4 py-2 ${step === index + 1 ? 'border-gold text-gold' : 'border-white/10'}`}>
              {label}
            </button>
          ))}
        </div>

        {step === 1 && (
          <section className="luxury-panel mt-8 rounded-3xl p-6">
            <h2 className="font-serif text-2xl">Shipping address</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className="luxury-input sm:col-span-2" placeholder="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
              <input className="luxury-input" placeholder="Phone number" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
              <input className="luxury-input sm:col-span-2" placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
              <input className="luxury-input" placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
              <input className="luxury-input" placeholder="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
              <input className="luxury-input sm:col-span-2" placeholder="Pincode" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
            </div>
            <button className="button-gold mt-6" onClick={() => setStep(2)}>Continue</button>
          </section>
        )}

        {step === 2 && (
          <section className="luxury-panel mt-8 rounded-3xl p-6">
            <h2 className="font-serif text-2xl">Payment method</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Choose a secure checkout method. Razorpay supports cards, UPI, wallets, and net banking through a branded payment modal.
            </p>
            <div className="mt-5 space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery', copy: 'Pay when your order arrives.', icon: CreditCard, accent: 'border-white/10 bg-black/20' },
                { value: 'razorpay', label: 'Razorpay', copy: 'Pay securely with cards, UPI, wallets, or net banking.', icon: ShieldCheck, accent: 'border-gold/30 bg-[linear-gradient(135deg,rgba(183,147,78,.18),rgba(255,255,255,.04))]' },
              ].map((option) => (
                <label key={option.value} className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition ${option.accent} ${form.paymentMethod === option.value ? 'ring-1 ring-gold/40' : ''}`}>
                  <span className="flex items-start gap-4">
                    <span className={`grid h-11 w-11 place-items-center rounded-full border ${form.paymentMethod === option.value ? 'border-gold/30 bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-stone-200'}`}>
                      <option.icon size={18} />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{option.label}</span>
                      <span className="mt-1 block text-sm leading-6 text-stone-200">{option.copy}</span>
                      {option.value === 'razorpay' && (
                        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-gold">
                          <BadgeCheck size={12} />
                          Secure gateway
                        </span>
                      )}
                    </span>
                  </span>
                  <input type="radio" name="paymentMethod" checked={form.paymentMethod === option.value} onChange={() => setForm({ ...form, paymentMethod: option.value as CheckoutForm['paymentMethod'] })} />
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="button-outline" onClick={() => setStep(1)}>Back</button>
              <button className="button-gold" onClick={() => setStep(3)}>Review order</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="luxury-panel mt-8 rounded-3xl p-6">
            <h2 className="font-serif text-2xl">Order review</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="h-16 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-serif text-lg">{item.name}</p>
                    <p className="text-sm text-stone-400">Qty {item.quantity}</p>
                  </div>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-2 text-sm text-stone-300">
              <p>Shipping to: {form.fullName || 'Not provided'}</p>
              <p>{form.address || 'Address not provided'}</p>
              <p>{form.city} {form.state} {form.pincode}</p>
              <p>Payment: {form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="button-outline" onClick={() => setStep(2)}>Back</button>
              <button className="button-gold" onClick={() => setStep(4)}>Place order</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="luxury-panel mt-8 rounded-3xl p-6">
            <h2 className="font-serif text-2xl">Finalize payment</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {form.paymentMethod === 'razorpay'
                ? `You will pay ₹${finalAmount.toFixed(2)} securely with Razorpay.`
                : `You are about to place an order for ₹${finalAmount.toFixed(2)}.`}
            </p>
            {form.paymentMethod === 'razorpay' && (
              <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/10 p-4 text-sm text-stone-100">
                <p className="flex items-center gap-2 font-semibold text-gold">
                  <ShieldCheck size={16} />
                  Razorpay secure checkout
                </p>
                <p className="mt-2 leading-7 text-stone-600">You’ll be redirected into Razorpay’s payment modal to complete the transaction and verify it before the order is created.</p>
              </div>
            )}
            {paymentError && <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{paymentError}</p>}
            <div className="mt-6 flex gap-3">
              <button className="button-outline" onClick={() => setStep(3)}>Back</button>
              <button className="button-gold" disabled={submitting || paymentLoading || !items.length} onClick={placeOrder}>
                {paymentLoading || submitting
                  ? 'Processing…'
                  : form.paymentMethod === 'razorpay'
                    ? `Pay with Razorpay · ₹${finalAmount.toFixed(2)}`
                    : `Place order · ₹${finalAmount.toFixed(2)}`}
              </button>
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-5">
        <div className="luxury-panel rounded-3xl p-6">
          <p className="eyebrow">Order total</p>
          <p className="mt-4 font-serif text-4xl text-ink">₹{finalAmount.toFixed(2)}</p>
          <div className="my-5 gold-line" />
          <p className="text-sm leading-6 text-ink/70">Luxury packaging, black-and-gold presentation, and complimentary shipping are included with every order.</p>
        </div>

        <CouponInput
          value={couponCode}
          onChange={(value) => setCouponCode(value.toUpperCase())}
          onApply={applyCoupon}
          onRemove={removeCoupon}
          loading={couponLoading}
          applied={Boolean(appliedCoupon)}
          error={couponError}
        />

        <DiscountSummary subtotal={total} discountAmount={discountAmount} finalAmount={finalAmount} couponCode={appliedCoupon?.code ?? null} />
      </aside>
    </div>
  );
}