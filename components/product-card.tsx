'use client';

import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist } from '@/store/slices/wishlistSlice';
import type { Product } from '@/store/types';

export function ProductCard({ product }: { product: Product }) {
	const dispatch = useAppDispatch();
	const wishlistItems = useAppSelector((state) => state.wishlist.items);
	const inWishlist = wishlistItems.some((item) => item._id === product._id);
	const reviewCount = product.totalReviews ?? product.reviews ?? 0;

	return (
		<motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="group animate-fade-in">
			<Link href={`/products/${product._id}`} className="relative block aspect-[.78] overflow-hidden border border-white/10 bg-black/20">
				<img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
				{product.bestseller && <span className="absolute left-3 top-3 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Bestseller</span>}
				<button
					onClick={(event) => {
						event.preventDefault();
						dispatch(addToWishlist(product));
					}}
					className={`absolute right-3 top-3 rounded-full border border-white/10 p-2 ${inWishlist ? 'bg-gold text-white' : 'bg-white/90 text-ink'}`}
				>
					<Heart size={15} className={inWishlist ? 'fill-white' : ''} />
				</button>
			</Link>
			<div className="pt-4">
				<p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">{product.brand}</p>
				<div className="mt-1 flex items-center justify-between gap-4">
					<Link href={`/products/${product._id}`} className="font-serif text-lg text-ink dark:text-white">
						{product.name}
					</Link>
					<span className="font-medium text-ink dark:text-white">${product.discountPrice || product.price}</span>
				</div>
				<div className="mt-2 flex items-center gap-1 text-xs text-stone-300">
					<Star size={13} className="fill-gold text-gold" /> {product.rating} <span className="text-stone-400">({reviewCount})</span>
				</div>
				<button onClick={() => dispatch(addToCart({ product, quantity: 1 }))} className="mt-4 text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-light">
					Add to bag +
				</button>
			</div>
		</motion.article>
	);
}
