'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { api } from '@/services/api';

interface OrderProduct {
  productId: { _id: string; name: string; slug: string };
  quantity: number;
  price: number;
}

interface ShippingAddress {
  recipient: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  shippingAddress: ShippingAddress;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-500/10', borderColor: 'border-yellow-200 dark:border-yellow-500/30' },
  processing: { icon: Package, label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10', borderColor: 'border-blue-200 dark:border-blue-500/30' },
  shipped: { icon: Truck, label: 'Shipped', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-500/10', borderColor: 'border-purple-200 dark:border-purple-500/30' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-500/10', borderColor: 'border-green-200 dark:border-green-500/30' },
  cancelled: { icon: AlertCircle, label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/10', borderColor: 'border-red-200 dark:border-red-500/30' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-black dark:text-white">
        <h1 className="font-serif text-5xl">My Orders</h1>
        <p className="mt-5 text-black dark:text-white">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 text-black dark:text-white">
      <div className="mb-10">
        <h1 className="font-serif text-5xl text-black dark:text-white">My Orders</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70 dark:text-white/70">Track your fragrance orders in real-time and view delivery details.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-4 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white/80 p-12 text-center dark:border-white/10 dark:bg-white/5">
          <Package size={48} className="mx-auto mb-4 text-black/30 dark:text-white/30" />
          <h2 className="font-serif text-2xl text-black dark:text-white">No orders yet</h2>
          <p className="mt-3 text-black/70 dark:text-white/70">Start your fragrance journey by exploring our collection.</p>
          <Link href="/products" className="button-gold mt-6 inline-flex gap-2 py-3">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.orderStatus];
            const StatusIcon = statusInfo.icon;
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            return (
              <div key={order._id} className="luxury-panel rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_30px_80px_rgba(20,18,15,.06)] dark:border-white/10 dark:bg-white/5">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-black dark:text-white">{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full border px-4 py-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
                    <StatusIcon size={16} className={statusInfo.color} />
                    <span className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>
                </div>

                {/* Date and Payment Status */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Order Date</p>
                    <p className="mt-1 text-sm font-medium text-black dark:text-white">{orderDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Payment Status</p>
                    <p className={`mt-1 text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : order.paymentStatus === 'failed' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Items</p>
                  <div className="space-y-3">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 rounded-2xl bg-black/2 p-4 dark:bg-white/2">
                        <div className="flex-1">
                          <Link href={`/products/${item.productId._id}`} className="font-semibold text-gold hover:underline">
                            {item.productId.name}
                          </Link>
                          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-black/60 dark:text-white/60">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Shipping Address</p>
                  <div className="rounded-2xl bg-black/2 p-4 text-sm text-black dark:bg-white/2 dark:text-white">
                    <p className="font-semibold">{order.shippingAddress.recipient}</p>
                    <p className="mt-1 text-black/80 dark:text-white/80">{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p className="text-black/80 dark:text-white/80">{order.shippingAddress.line2}</p>}
                    <p className="mt-1 text-black/80 dark:text-white/80">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p className="text-black/80 dark:text-white/80">{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p className="mt-1 text-black/80 dark:text-white/80">Phone: {order.shippingAddress.phone}</p>}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/70 dark:text-white/70">Subtotal</span>
                      <span className="font-medium text-black dark:text-white">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-green-600 dark:text-green-400">{order.couponCode ? `Discount (${order.couponCode})` : 'Discount'}</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-₹{order.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-black/10 pt-2 dark:border-white/10">
                      <div className="flex justify-between">
                        <span className="font-semibold text-black dark:text-white">Total</span>
                        <span className="font-serif text-lg font-semibold text-gold">₹{order.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[.24em] text-black/60 dark:text-white/60">Status Timeline</p>
                  <div className="flex items-center justify-between">
                    {(['pending', 'processing', 'shipped', 'delivered'] as const).map((status, idx) => {
                      const isCompleted = ['processing', 'shipped', 'delivered'].includes(order.orderStatus) && ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= idx;
                      const isCurrent = order.orderStatus === status;
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition ${isCurrent ? 'border-gold bg-gold/10' : isCompleted ? 'border-green-500 bg-green-500/10' : 'border-black/20 bg-transparent dark:border-white/20'}`}>
                            {isCompleted && !isCurrent && <CheckCircle size={16} className="text-green-500" />}
                            {isCurrent && <div className="h-2 w-2 rounded-full bg-gold" />}
                          </div>
                          <p className={`mt-2 text-xs font-semibold uppercase tracking-[.14em] ${isCurrent || isCompleted ? 'text-black dark:text-white' : 'text-black/40 dark:text-white/40'}`}>{status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Link */}
      <div className="mt-10 text-center">
        <Link href="/products" className="text-sm text-gold hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
