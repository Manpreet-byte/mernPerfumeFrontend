'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PerfumeCarouselProps = {
	eyebrow: string;
	title: string;
	copy: string;
	badge?: string;
};

const slides = [
	{
		src: 'https://rukminim3.flixcart.com/image/480/480/xif0q/perfume/g/q/z/100-cityman-extrait-de-parfum-extrait-de-parfum-b-perfume-men-original-imahccxteppvzusz.jpeg?q=90',
		alt: 'Luxury men\'s perfume bottle with a clean amber tone',
		caption: 'Deep, modern, and polished',
	},
	{
		src: 'https://beardo.in/cdn/shop/files/image_8133736f-8eb3-4b8a-a7d8-e3c4aca4cf08.png?format=webp&quality=80&v=1777634607&width=1076',
		alt: 'Fragrance bottle with premium beardo styling',
		caption: 'Refined everyday signature',
	},
	{
		src: 'https://media.istockphoto.com/id/2148769570/photo/female-hands-holding-a-bottle-of-perfume-in-natural-morning-light.jpg?s=612x612&w=0&k=20&c=pneG75JUpT6ni_k_9GVBgE6B1JyFFixCuDqca8tNUSY=',
		alt: 'Hands holding a perfume bottle in warm morning light',
		caption: 'Bright, elegant, and fresh',
	},
	{
		src: 'https://images.elle.com.br/2024/11/perfumes-importados.jpg',
		alt: 'Assorted imported perfumes on a luxe surface',
		caption: 'A curated fragrance shelf',
	},
	{
		src: 'https://static.stealthelook.com.br/wp-content/uploads/2022/07/perfumes-importados-marcas-internacionais-perfume-essencia-de-luxo-steal-the-look-20220721195421.jpg',
		alt: 'Luxury perfume bottles with editorial styling',
		caption: 'Editorial and immersive',
	},
	{
		src: 'https://http2.mlstatic.com/D_NQ_NP_873710-MLB108655827194_032026-O.webp',
		alt: 'Perfume product image with a premium retail feel',
		caption: 'A premium finishing touch',
	},
];

export function PerfumeCarousel({ eyebrow, title, copy, badge = 'Curated fragrance edit' }: PerfumeCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % slides.length);
		}, 4500);

		return () => window.clearInterval(timer);
	}, []);

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 p-5 shadow-[0_30px_90px_rgba(20,18,15,.14)] dark:border-white/10 dark:bg-white/5 sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="eyebrow">{eyebrow}</p>
					<h2 className="mt-3 font-serif text-3xl leading-tight text-ink dark:text-white sm:text-4xl">{title}</h2>
				</div>
				<span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-gold">
					{badge}
				</span>
			</div>

			<p className="mt-4 max-w-md text-sm leading-7 text-ink/70 dark:text-white/70">{copy}</p>

			<div className="relative mt-6 flex-1 overflow-hidden rounded-[2rem] bg-black/5">
				{slides.map((slide, index) => (
					<motion.div
						key={slide.src}
						initial={false}
						animate={{ opacity: index === activeIndex ? 1 : 0, scale: index === activeIndex ? 1 : 1.03 }}
						transition={{ duration: 0.65, ease: 'easeOut' }}
						className="absolute inset-0"
					>
						<img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
						<div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,14,12,.82)_0%,rgba(16,14,12,.25)_45%,rgba(16,14,12,.05)_100%)]" />
					</motion.div>
				))}

				<div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-6">
					<p className="text-[10px] font-bold uppercase tracking-[.28em] text-gold/90">{activeSlide.caption}</p>
					<p className="mt-2 max-w-sm font-serif text-2xl leading-tight sm:text-3xl">Every slide is chosen to feel editorial, warm, and luxurious.</p>
				</div>

				<div className="absolute right-4 top-4 z-10 flex items-center gap-2">
					<button
						type="button"
						onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
						className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition hover:bg-black/40"
						aria-label="Previous perfume"
					>
						<ChevronLeft size={18} />
					</button>
					<button
						type="button"
						onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
						className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition hover:bg-black/40"
						aria-label="Next perfume"
					>
						<ChevronRight size={18} />
					</button>
				</div>

				<div className="absolute bottom-4 left-4 z-10 flex gap-2">
					{slides.map((slide, index) => (
						<button
							key={slide.src}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-gold' : 'w-2.5 bg-white/60 hover:bg-white'}`}
							aria-label={`Show perfume ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}