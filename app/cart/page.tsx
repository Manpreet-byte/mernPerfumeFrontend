'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, total } = useAppSelector((state) => state.cart);

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm">
      <div className="flex h-full justify-end">
        <motion.aside
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-[#11100e]/95 shadow-2xl shadow-black/40"
        >
          <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="eyebrow">Your selection</p>
              <h1 className="mt-2 font-serif text-4xl text-white">Shopping bag</h1>
            </div>
            <button
              onClick={() => (window.history.length > 1 ? router.back() : router.push('/products'))}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-stone-300 transition hover:border-gold hover:text-gold"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!items.length ? (
              <div className="luxury-panel grid h-full place-items-center rounded-3xl p-8 text-center">
                <div>
                  <p className="text-sm text-black dark:text-stone-300">Your bag is waiting for a beautiful scent.</p>
                  <Link className="button-gold mt-6 !text-black" href="/products">Browse fragrances</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item._id} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/10">
                    <img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl object-cover ring-1 ring-white/10" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl text-white">{item.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[.2em] text-gold">{item.brand}</p>
                        </div>
                        <button onClick={() => dispatch(removeFromCart(item._id))} className="text-stone-400 transition hover:text-gold">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="mt-3 text-sm text-stone-300">₹{item.price.toFixed(2)}</p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2">
                          <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))} className="text-white/80 transition hover:text-gold">
                            <Minus size={15} />
                          </button>
                          <span className="min-w-6 text-center text-sm text-white">{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="text-white/80 transition hover:text-gold">
                            <Plus size={15} />
                          </button>
                        </div>
                        <p className="text-sm text-stone-300">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </article>
                ))}

                <div className="flex justify-end pt-2">
                  <button onClick={() => dispatch(clearCart())} className="text-xs font-bold uppercase tracking-widest text-stone-400 transition hover:text-white">
                    Clear cart
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-6 py-5">
            <div className="rounded-3xl border border-gold/20 bg-gold/10 p-5">
              <h2 className="font-serif text-2xl text-white">Order summary</h2>
              <div className="my-4 h-px bg-gold/50" />
              <div className="flex justify-between text-sm text-stone-300">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-stone-300">
                <span>Delivery</span>
                <span>Complimentary</span>
              </div>
              <div className="my-4 h-px bg-gold/50" />
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="button-gold mt-5 w-full">
                Checkout
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}