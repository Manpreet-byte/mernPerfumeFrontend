import Link from 'next/link';
import { ArrowRight, Clock3, ShieldCheck, Sparkles, WandSparkles, Flame, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';

const principles = [
	{ title: 'Curated with intent', copy: 'Every fragrance enters the collection for a reason: emotional clarity, craftsmanship, and lasting presence.', icon: Sparkles },
	{ title: 'Luxury without noise', copy: 'We keep the edit focused, the service personal, and the experience elegant from browsing to delivery.', icon: ShieldCheck },
	{ title: 'Guided discovery', copy: 'Concierge support, thoughtful sampling, and recommendations shaped around your ritual.', icon: WandSparkles },
];

const timeline = [
	{ year: '2018', title: 'Aurelia is founded', copy: 'A single boutique and a focused idea: fragrance should feel intimate, elevated, and emotionally resonant.' },
	{ year: '2020', title: 'Concierge service expands', copy: 'The house adds guided discovery, gifting support, and deeper one-to-one recommendations.' },
	{ year: '2024', title: 'A broader edit', copy: 'A refined digital experience brings the collection to a wider audience without losing its editorial feel.' },
];

const studioNotes = [
	'Independent ateliers only',
	'Sampling on request',
	'Gift wrapping included',
	'Carefully sourced ingredients',
];

const luxuryFragrances = [
	{ name: 'Velvet Amber', image: 'https://imgmedia.lbb.in/media/2023/08/64ec7dc214687d307c00b26c_1693220290331.jpg', price: '$185' },
	{ name: 'Noir Bloom', image: 'https://hips.hearstapps.com/hmg-prod/images/img-2857-jpg-6920aa2de3c98.jpg?crop=1.00xw:0.939xh;0,0.0612xh', price: '$220' },
	{ name: 'Rose Atelier', image: 'https://mir-s3-cdn-cf.behance.net/projects/404/c5d40f238077057.Y3JvcCwxMDA3LDc4OCwxOTcsMA.png', price: '$195' },
	{ name: 'Golden Vetiver', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9AxgjZxFMnQmcawdUJCYyhm4xoBVqxt5O4J6wYFWqd5qxZy5Q_p9jBTaO&s=10', price: '$165' },
	{ name: 'Aurelia Signature', image: 'https://cdn.shopify.com/s/files/1/0673/2664/0426/files/pexels-photo-8450361.webp?v=1716560739', price: '$240' },
	{ name: 'Silk Petals', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWOyDZTfYmAcVFfWprV80oT2DKuOD6MauGNGvE3NTg-J9U6Yhmn4mJi08&s=10', price: '$205' },
	{ name: 'Velvet Rose', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk9G7sNFGlFudy3rEP_RewvKe1Fdn5R-RxBaxA-Muz-kOxU1M096C2Fjyl&s=10', price: '$210' },
	{ name: 'Golden Noir', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9u1yuJMiN667gSyQc4oTqB15p_Gz35TTbti96oKvtH8PMEkRRjKAtugSr&s=10', price: '$225' },
];

export default function AboutPage() {
	return (
		<div>
			<section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
					<div className="space-y-10">
						<div className="max-w-2xl">
							<SectionHeading
								eyebrow="Our story"
								title="Perfume, edited with feeling."
								copy="Aurelia began with a simple belief: the right scent does more than smell beautiful. It has the power to bring you back to yourself."
							/>
							<p className="mt-6 text-base leading-8 text-ink/70 dark:text-white/70">We work closely with independent noses and small ateliers to curate a focused collection — each composition chosen for its emotional clarity and lasting character. Our team tastes collectively, shops consciously, and serves personally.</p>
						</div>

						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{principles.map((principle) => {
								const Icon = principle.icon;
								return (
									<div key={principle.title} className="luxury-panel rounded-3xl p-5">
										<span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold"><Icon size={18} /></span>
										<h3 className="mt-4 font-serif text-2xl">{principle.title}</h3>
										<p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">{principle.copy}</p>
									</div>
								);
							})}
						</div>

						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<Link href="/products" className="button-gold gap-2">Shop the edit <ArrowRight size={15} /></Link>
							<Link href="/contact" className="button-outline">Speak to a concierge</Link>
						</div>
					</div>

					<div className="relative">
						<div className="absolute -inset-4 -z-10 rounded-[2.25rem] bg-[radial-gradient(circle_at_top,_rgba(183,147,78,.2),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,18,15,.16),transparent_30%)] blur-2xl" />
						<div className="luxury-panel overflow-hidden rounded-[2rem]">
							<img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85" alt="Aurelia atelier" className="h-[320px] w-full object-cover sm:h-[420px]" />
							<div className="grid gap-4 border-t border-ink/10 p-6 sm:grid-cols-3 dark:border-white/10">
								<div>
									<p className="eyebrow">Founded</p>
									<p className="mt-2 font-serif text-2xl sm:text-3xl">2018</p>
								</div>
								<div>
									<p className="eyebrow">Collections</p>
									<p className="mt-2 font-serif text-2xl sm:text-3xl">Curated</p>
								</div>
								<div>
									<p className="eyebrow">Service</p>
									<p className="mt-2 font-serif text-2xl sm:text-3xl">Concierge</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 py-10">
				<div className="grid gap-4 rounded-[2rem] bg-ink p-8 text-white lg:grid-cols-[.9fr_1.1fr] lg:items-center">
					<div>
						<p className="eyebrow">Our standard</p>
						<p className="mt-5 font-serif text-3xl leading-relaxed">We select compositions with depth, distinctiveness, and the rare ability to make a moment feel entirely your own.</p>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						{studioNotes.map((note) => (
							<div key={note} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-stone-100 backdrop-blur">{note}</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 py-20">
				<SectionHeading eyebrow="How we work" title="Our philosophy in practice" copy="The house is built around a few very deliberate promises." />
				<div className="grid gap-6 md:grid-cols-3">
					<div className="luxury-panel rounded-3xl p-6">
						<p className="eyebrow">Mission</p>
						<h3 className="mt-3 font-serif text-2xl">Choose with care.</h3>
						<p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">To present a concise collection of poignant scents that reward attention and invite ritual.</p>
					</div>
					<div className="luxury-panel rounded-3xl p-6">
						<p className="eyebrow">Craft</p>
						<h3 className="mt-3 font-serif text-2xl">Respect the formula.</h3>
						<p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">We prioritize thoughtful accords, expressive materials, and transparency about provenance.</p>
					</div>
					<div className="luxury-panel rounded-3xl p-6">
						<p className="eyebrow">Service</p>
						<h3 className="mt-3 font-serif text-2xl">Make it personal.</h3>
						<p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">Personalized recommendations, samples on request, and careful packaging for every order.</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 py-20">
			<div className="relative rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
				<div className="absolute inset-0 bg-black/30" />
				<div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 p-6 shadow-luxe dark:border-white/10 dark:bg-[#0b0a08]/90">
					<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-black dark:to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-black dark:to-transparent" />
					<div className="carousel-track">
						{[...luxuryFragrances, ...luxuryFragrances].map((item, index) => (
							<div key={`${item.name}-${index}`} className="carousel-card">
								<img src={item.image} alt={item.name} className="h-[380px] w-full object-cover object-center sm:h-[420px]" />
								<div className="carousel-copy">
									<p className="text-xs font-semibold uppercase tracking-[.22em] text-gold">Signature bottle</p>
									<h3 className="mt-3 font-serif text-2xl text-ink dark:text-white">{item.name}</h3>
									<p className="mt-2 text-sm leading-7 text-ink/70 dark:text-white/70">{item.price} · A refined fragrance for special evenings, gifts, and unforgettable moments.</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>

		<section className="bg-ink px-6 py-16 text-white">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
					<div>
						<p className="eyebrow">Timeline</p>
						<h3 className="mt-4 font-serif text-4xl">The house has grown deliberately.</h3>
						<p className="mt-4 max-w-lg text-sm leading-7 text-stone-300">Each milestone marked a refinement in how we curate, present, and support the collection.</p>
					</div>
					<div className="space-y-4">
						{timeline.map((item) => (
							<div key={item.year} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
								<div className="flex flex-wrap items-start gap-4">
									<div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold"><Clock3 size={18} /></div>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-bold uppercase tracking-[.22em] text-gold">{item.year}</p>
										<h4 className="mt-2 font-serif text-2xl text-white">{item.title}</h4>
										<p className="mt-2 text-sm leading-7 text-stone-300">{item.copy}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
    </div>
  );
}

