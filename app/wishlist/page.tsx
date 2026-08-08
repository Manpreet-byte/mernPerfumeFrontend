'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.wishlist.items);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 text-ink dark:text-white">
      <p className="eyebrow">Saved for later</p>
      <h1 className="mt-3 font-serif text-5xl">Wishlist</h1>
      {!items.length ? (
        <div className="luxury-panel mt-12 rounded-3xl py-14 text-center">
          <Heart className="mx-auto text-gold" />
          <p className="mt-4 text-stone-300">No saved fragrances yet.</p>
          <Link className="button-gold mt-6" href="/products">Discover fragrances</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <article key={product._id} className="luxury-panel overflow-hidden rounded-3xl">
              <Link href={`/products/${product._id}`} className="block aspect-[.92] overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">{product.brand}</p>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <Link href={`/products/${product._id}`} className="font-serif text-xl">{product.name}</Link>
                  <span>${product.discountPrice || product.price}</span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => dispatch(addToCart({ product, quantity: 1 }))} className="button-outline flex-1 gap-2">
                    <ShoppingBag size={14} /> Move to cart
                  </button>
                  <button onClick={() => dispatch(removeFromWishlist(product._id))} className="rounded-full border border-white/10 p-3 text-stone-300 hover:text-gold">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}