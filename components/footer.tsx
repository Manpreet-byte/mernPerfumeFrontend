import Link from 'next/link';

export function Footer() {
	return (
		<footer className="mt-20 bg-ink px-6 py-14 text-stone-300">
			<div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
				<div>
					<p className="font-serif text-2xl tracking-[.25em] text-white">AURELIA</p>
					<p className="mt-4 max-w-xs text-sm leading-6">A considered collection of scents that become part of your story.</p>
					<div className="mt-6 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[.24em] text-stone-400">
						<span className="rounded-full border border-white/10 px-3 py-2 text-center">Luxury</span>
						<span className="rounded-full border border-white/10 px-3 py-2 text-center">Concierge</span>
						<span className="rounded-full border border-white/10 px-3 py-2 text-center">Rare</span>
					</div>
				</div>
				<div>
					<p className="eyebrow">Service</p>
					<div className="mt-4 flex flex-col gap-2 text-sm">
						<Link href="/contact">Contact us</Link>
						<Link href="/about">Our story</Link>
						<Link href="/profile">My account</Link>
					</div>
				</div>
				<div>
					<p className="eyebrow">The Private List</p>
					<p className="mt-4 text-sm">New arrivals, intimate stories, and a little indulgence.</p>
					<div className="mt-4 flex">
						<input className="w-full bg-white/10 px-3 py-2 text-sm outline-none" placeholder="Your email" />
						<button className="bg-gold px-4 text-xs font-bold text-white">JOIN</button>
					</div>
				</div>
				<div>
					<p className="eyebrow">Atelier</p>
					<p className="mt-4 text-sm leading-6">Private gifting, seasonal edits, and one-on-one fragrance consultations.</p>
					<div className="mt-5 grid gap-2 text-sm text-stone-400">
						<span>Monday - Saturday</span>
						<span>9:00 AM - 7:00 PM</span>
						<span>hello@aureliafragrance.com</span>
					</div>
				</div>
			</div>
			<p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-stone-500">© 2026 Aurelia Fine Fragrance. All rights reserved.</p>
		</footer>
	);
}
