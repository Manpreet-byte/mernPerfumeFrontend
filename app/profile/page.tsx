'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, WandSparkles, ShieldCheck, Package, Truck, CheckCircle, Clock, AlertCircle, ShoppingBag, CreditCard, ClipboardList, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, logout } from '@/store/slices/authSlice';
import { AuthShell } from '@/components/auth-shell';
import { PageHeading } from '@/app/admin/_components/page-heading';
import { DataTable } from '@/app/admin/_components/data-table';
import { api } from '@/services/api';

type OrderProduct = {
  productId: { _id: string; name: string; slug: string };
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  products: OrderProduct[];
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  finalAmount: number;
  createdAt: string;
};

type OrderRow = {
  id: string;
  orderNumber: string;
  itemCount: string;
  date: string;
  status: Order['orderStatus'];
  payment: Order['paymentStatus'];
  total: string;
};

type ProfileAddress = {
  _id?: string;
  label?: string;
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

const orderStatusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400' },
  processing: { label: 'Processing', icon: Package, className: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400' },
  shipped: { label: 'Shipped', icon: Truck, className: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-400' },
  delivered: { label: 'Delivered', icon: CheckCircle, className: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400' },
};

const paymentStatusClass = {
  pending: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400',
  paid: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400',
  failed: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
};

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const highlights = [
  { title: 'Fresh start', copy: 'Your saved session is cleared, but your fragrance history is still only a sign in away.', icon: Sparkles },
  { title: 'Curated edits', copy: 'Discover a tighter collection of perfumes, now with richer editorial storytelling.', icon: WandSparkles },
  { title: 'Secure return', copy: 'Log in again with Google or email and continue from the same protected account flow.', icon: ShieldCheck },
  ];

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
    else {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          setOrdersError('');
          const response = await api.get('/orders');
          setOrders(response.data);
        } catch (err) {
          console.error('Failed to fetch orders:', err);
          setOrdersError('We could not load your orders right now. Please try again in a moment.');
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [dispatch, user]);

  const recentOrderRows = useMemo<OrderRow[]>(
    () =>
      orders.slice(0, 5).map((order) => ({
        id: order._id,
        orderNumber: order._id.slice(-8).toUpperCase(),
        itemCount: `${order.products.reduce((count, item) => count + item.quantity, 0)} item${order.products.reduce((count, item) => count + item.quantity, 0) === 1 ? '' : 's'}`,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: order.orderStatus,
        payment: order.paymentStatus,
        total: `₹${order.finalAmount.toFixed(2)}`,
      })),
    [orders],
  );

  const summaryCards = [
    { label: 'Saved scents', value: '3', icon: Sparkles },
    { label: 'Orders', value: ordersLoading ? '...' : `${orders.length}`, icon: ClipboardList },
    { label: 'Cart items', value: `${cartItems.length}`, icon: ShoppingCart },
    { label: 'Checkout ready', value: cartItems.length > 0 ? 'Yes' : 'No', icon: CreditCard },
  ];

  const profileCards = [
    { label: 'Name', value: user!.name },
    { label: 'Email', value: user!.email },
    { label: 'Role', value: user!.role },
    { label: 'Auth', value: user!.authProvider === 'google' ? 'Google' : 'Email' },
    { label: 'Phone', value: user!.phone || 'Not added' },
    { label: 'Joined', value: user!.createdAt ? new Date(user!.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown' },
  ];

  const addresses = (user!.addresses || []) as ProfileAddress[];
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];

  if (loading && !user) return <div className="mx-auto max-w-4xl px-6 py-20 text-black dark:text-white"><h1 className="font-serif text-5xl">Your account</h1><p className="mt-5 text-black">Loading profile…</p></div>;

  if (!user) {
    return (
      <AuthShell
        eyebrow="Signed out"
        title="Your account is ready when you are."
        copy="You’re no longer signed in, but your profile, wishlist, and order history will be waiting after a quick return."
        highlights={highlights}
      >
        <div className="text-black dark:text-white">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            <div className="relative h-72 overflow-hidden">
              <img src="https://www.lightxeditor.com/blog/wp-content/uploads/2026/01/image4-1.webp" alt="Perfume bottles arranged on a table" className="h-full w-full object-cover object-center" loading="eager" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white drop-shadow-lg">
                <p className="eyebrow text-gold/90">Aurelia ritual</p>
                <h2 className="mt-3 font-serif text-4xl leading-tight">Return to your fragrance wardrobe.</h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-black">Sign in again to revisit your wishlist, saved details, and curated order history.</p>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Link href="/login" className="button-gold gap-2 py-4 text-sm">Sign in <ArrowRight size={15} /></Link>
              <Link href="/signup" className="button-outline gap-2 py-4 text-sm">Create account</Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">What awaits</p>
              <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">Profile details, wishlist items, and your order history return instantly once you sign back in.</p>
            </div>
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">Discover more</p>
              <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">Browse the latest perfume edit while you decide which scent fits the next chapter.</p>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  const orderColumns = [
    {
      label: 'Order',
      render: (row: OrderRow) => <span className="font-mono text-xs font-semibold tracking-[.18em] text-ink dark:text-white">#{row.orderNumber}</span>,
    },
    {
      label: 'Items',
      render: (row: OrderRow) => <span className="text-sm text-ink/70 dark:text-white/70">{row.itemCount}</span>,
    },
    {
      label: 'Date',
      render: (row: OrderRow) => <span className="text-sm text-ink/70 dark:text-white/70">{row.date}</span>,
    },
    {
      label: 'Status',
      render: (row: OrderRow) => {
        const statusInfo = orderStatusConfig[row.status];
        const StatusIcon = statusInfo.icon;
        return (
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${statusInfo.className}`}>
            <StatusIcon size={14} />
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      label: 'Payment',
      render: (row: OrderRow) => (
        <span className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${paymentStatusClass[row.payment]}`}>
          {row.payment.charAt(0).toUpperCase() + row.payment.slice(1)}
        </span>
      ),
    },
    {
      label: 'Total',
      render: (row: OrderRow) => <span className="font-semibold text-ink dark:text-white">{row.total}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-ink dark:bg-[#171411] dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <PageHeading
          eyebrow="Customer profile"
          title={`Welcome back, ${user!.name}`}
          description="Your profile now follows the same dashboard language as the admin area, with account details, order tracking, and checkout shortcuts in one place."
          action={
            <div className="flex flex-wrap gap-3">
                <Link href="/orders" className="button-outline gap-2 border-ink/20 text-ink hover:border-gold hover:text-gold dark:border-white/15 dark:text-white">
                <ClipboardList size={15} />
                  Track orders
              </Link>
              <Link href={cartItems.length > 0 ? '/checkout' : '/products'} className="button-gold gap-2">
                <ShoppingBag size={15} />
                {cartItems.length > 0 ? 'Checkout' : 'Shop now'}
              </Link>
            </div>
          }
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <section key={card.label} className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center bg-gold/10 text-gold"><Icon size={20} /></span>
                </div>
                <p className="mt-6 text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">{card.label}</p>
                <p className="mt-2 font-serif text-3xl text-ink dark:text-white">{card.value}</p>
              </section>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_.92fr]">
          <section className="border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.03]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow">Account details</p>
                <h2 className="mt-2 font-serif text-3xl text-ink dark:text-white">Profile and support</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60 dark:text-white/60">This area mirrors the admin dashboard feel so every customer sees the same polished account experience, with clear status, strong contrast, and direct actions.</p>
              </div>
              <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[.24em] text-gold">Verified</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {profileCards.map((card) => (
                <div key={card.label} className="border border-ink/10 bg-stone-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[.22em] text-ink/60 dark:text-white/60">{card.label}</p>
                  <p className="mt-2 break-words font-medium text-ink dark:text-white">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-ink/10 bg-stone-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[.22em] text-ink/60 dark:text-white/60">Default address</p>
                  <p className="mt-2 font-serif text-xl text-ink dark:text-white">{defaultAddress ? defaultAddress.label || 'Saved address' : 'No address saved yet'}</p>
                </div>
                <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-gold">{addresses.length} saved</span>
              </div>
              {defaultAddress ? (
                <div className="mt-4 space-y-1 text-sm leading-6 text-ink/70 dark:text-white/70">
                  <p className="font-semibold text-ink dark:text-white">{defaultAddress.recipient}</p>
                  <p>{defaultAddress.line1}</p>
                  {defaultAddress.line2 && <p>{defaultAddress.line2}</p>}
                  <p>{defaultAddress.city}{defaultAddress.state ? `, ${defaultAddress.state}` : ''} {defaultAddress.postalCode}</p>
                  <p>{defaultAddress.country}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-ink/70 dark:text-white/70">Add a shipping address once and it will appear here for faster checkout and order tracking.</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="button-outline border-ink/20 text-ink hover:border-gold hover:text-gold dark:border-white/15 dark:text-white">Edit profile</button>
              <Link href="/products" className="button-outline border-ink/20 text-ink hover:border-gold hover:text-gold dark:border-white/15 dark:text-white">Browse products</Link>
            </div>
          </section>

          <section className="border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.03]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Shopping flow</p>
                <h2 className="mt-2 font-serif text-3xl text-ink dark:text-white">Checkout and orders</h2>
                <p className="mt-3 text-sm leading-7 text-ink/60 dark:text-white/60">Use the same path every customer sees: add products, check out, then track the order here or in the dedicated orders view.</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold"><CreditCard size={18} /></span>
            </div>

            <div className="mt-6 space-y-4">
              {ordersError && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-300">
                  {ordersError}
                </div>
              )}

              {ordersLoading ? (
                <div className="rounded-2xl border border-ink/10 bg-stone-50 p-4 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">Loading your recent orders…</div>
              ) : recentOrderRows.length > 0 ? (
                <DataTable
                  columns={orderColumns}
                  rows={recentOrderRows}
                  pageSize={5}
                  renderActions={(row) => (
                    <Link href="/orders" className="text-sm font-semibold text-gold hover:underline">
                      Open
                    </Link>
                  )}
                />
              ) : (
                <div className="rounded-2xl border border-ink/10 bg-stone-50 p-5 text-sm text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                  No orders yet. Once you place your first order, it will appear here with the same tracking view used across the app.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/orders" className="button-outline border-ink/20 text-ink hover:border-gold hover:text-gold dark:border-white/15 dark:text-white">All orders</Link>
              <Link href={cartItems.length > 0 ? '/checkout' : '/products'} className="button-gold gap-2">
                <ShoppingBag size={15} />
                {cartItems.length > 0 ? 'Go to checkout' : 'Start shopping'}
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Link href="/orders" className="border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/30 dark:border-white/10 dark:bg-white/[.03]">
            <p className="text-xs uppercase tracking-[.24em] text-gold">Orders</p>
            <p className="mt-3 font-serif text-3xl text-ink dark:text-white">Track</p>
            <p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">Open your full order history and delivery updates.</p>
          </Link>
          <Link href={cartItems.length > 0 ? '/checkout' : '/products'} className="border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/30 dark:border-white/10 dark:bg-white/[.03]">
            <p className="text-xs uppercase tracking-[.24em] text-gold">Checkout</p>
            <p className="mt-3 font-serif text-3xl text-ink dark:text-white">Ready</p>
            <p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">Jump straight back into payment when your cart is ready.</p>
          </Link>
          <Link href="/products" className="border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/30 dark:border-white/10 dark:bg-white/[.03]">
            <p className="text-xs uppercase tracking-[.24em] text-gold">Shopping</p>
            <p className="mt-3 font-serif text-3xl text-ink dark:text-white">Browse</p>
            <p className="mt-3 text-sm leading-6 text-ink/70 dark:text-white/70">Continue discovery with the same polished storefront flow.</p>
          </Link>
        </div>

        <button className="mt-8 text-xs font-bold uppercase tracking-widest text-gold" onClick={() => { dispatch(logout()); router.push('/profile'); }}>
          Log out
        </button>
      </div>
    </div>
  );
}