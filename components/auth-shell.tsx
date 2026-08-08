'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

type Highlight = {
	title: string;
	copy: string;
	icon: LucideIcon;
};

type AuthShellProps = {
	eyebrow: string;
	title: string;
	copy: string;
	highlights: Highlight[];
	children: ReactNode;
};

const fallbackHighlights: Highlight[] = [
	{ title: 'Secure access', copy: 'JWT sessions and Google OAuth keep sign-in simple and protected.', icon: ShieldCheck },
	{ title: 'Fast return', copy: 'Pick up where you left off with saved profile and cart data.', icon: UserRound },
	{ title: 'Premium flow', copy: 'A refined account experience that feels aligned with the storefront.', icon: Sparkles },
];

export function AuthShell({ eyebrow, title, copy, highlights, children }: AuthShellProps) {
	const cards = highlights.length ? highlights : fallbackHighlights;

	return (
		<section className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(183,147,78,.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(20,18,15,.12),_transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(183,147,78,.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,.06),_transparent_26%)]" />
			<div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
			<div className="mx-auto grid max-w-7xl gap-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.02fr_.98fr] lg:items-center">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: 'easeOut' }} className="max-w-xl text-ink dark:text-white">
					<p className="eyebrow">Aurelia account</p>
					<h1 className="mt-5 font-serif text-4xl leading-[.95] sm:text-5xl md:text-7xl">{title}</h1>
					<p className="mt-6 max-w-lg text-base leading-7 text-ink/80 dark:text-white/80">{copy}</p>
					<div className="mt-8 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
						<div className="relative overflow-hidden rounded-[2rem] shadow-[0_22px_50px_rgba(20,18,15,.12)]">
							<img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85" alt="Elegant perfume bottles and warm lighting" className="h-60 w-full object-cover sm:h-72" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-5 text-white">
								<p className="text-[10px] font-bold uppercase tracking-[.24em] text-gold/90">Signature edit</p>
								<p className="mt-2 font-serif text-2xl">Perfume, styled like art.</p>
							</div>
						</div>
						<div className="grid gap-4">
							<div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_18px_40px_rgba(20,18,15,.1)]">
								<img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=85" alt="Luxury perfume bottle close-up" className="h-28 w-full object-cover sm:h-36" />
							</div>
							<div className="luxury-panel rounded-[1.75rem] p-4">
								<p className="eyebrow">Curated image</p>
								<p className="mt-2 text-sm leading-6 text-ink/70 dark:text-white/70">A polished visual cue that keeps the auth flow aligned with the fragrance brand.</p>
							</div>
						</div>
					</div>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{cards.map((card) => {
							const Icon = card.icon;
							return (
								<div key={card.title} className="luxury-panel rounded-3xl p-5">
									<div className="flex items-center gap-3">
										<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
											<Icon size={18} />
										</span>
										<p className="font-serif text-xl">{card.title}</p>
									</div>
									<p className="mt-3 text-sm leading-7 text-ink/80 dark:text-white/80">{card.copy}</p>
								</div>
							);
						})}
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.06, ease: 'easeOut' }}>
					<div className="luxury-panel rounded-[2rem] p-6 shadow-[0_30px_90px_rgba(20,18,15,.12)] sm:p-8 lg:p-10">
						{children}
					</div>
				</motion.div>
			</div>
		</section>
	);
}