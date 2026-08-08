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
	{ name: 'Midnight Oud', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=85', price: '$185' },
	{ name: 'Golden Essence', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=85', price: '$220' },
	{ name: 'Rose Absolue', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=85', price: '$195' },
	{ name: 'Citrus Luxe', image: 'https://images.unsplash.com/photo-1618498082410-b4aa3d82f0cf?auto=format&fit=crop&w=500&q=85', price: '$165' },
];

export default function AboutPage() {
	return (
		<div>
			<section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
				<div className="space-y-8">
					<div>
						<SectionHeading
							eyebrow="Our story"
							title="Perfume, edited with feeling."
							copy="Aurelia began with a simple belief: the right scent does more than smell beautiful. It has the power to bring you back to yourself."
						/>
						<p className="max-w-2xl text-sm leading-7 text-ink/70 dark:text-white/70">We work closely with independent noses and small ateliers to curate a focused collection — each composition chosen for its emotional clarity and lasting character. Our team tastes collectively, shops consciously, and serves personally.</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
					<div className="flex flex-wrap gap-3">
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
				<SectionHeading eyebrow="Meet the team" title="People behind Aurelia" copy="A small group of editors, curators, and operators working with one shared standard." />
				<div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
					<div className="grid gap-6 sm:grid-cols-2">
						{[
							{ name: 'Isabella Maren', role: 'Founder & Director', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
							{ name: 'Olivier Blanche', role: 'Head of Curation', image: 'https://images.unsplash.com/photo-1546456073-6712f79251bb?auto=format&fit=crop&w=600&q=80' },
							{ name: 'Maya Hart', role: 'Fragrance Concierge', image: 'https://images.unsplash.com/photo-1545996124-1b4f6d5b1f1f?auto=format&fit=crop&w=600&q=80' },
							{ name: 'Jonas Reed', role: 'Operations', image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=600&q=80' },
						].map((member) => (
							<div key={member.name} className="luxury-panel overflow-hidden rounded-3xl">
								<img src={member.image} alt={member.name} className="h-56 w-full object-cover" />
								<div className="p-5">
									<p className="font-serif text-2xl">{member.name}</p>
									<p className="mt-1 text-sm text-ink/60 dark:text-white/60">{member.role}</p>
								</div>
							</div>
						))}
					</div>
					<div className="luxury-panel rounded-[2rem] p-8">
						<p className="eyebrow">Inside the atelier</p>
						<h3 className="mt-3 font-serif text-4xl">A house shaped by taste, not volume.</h3>
						<p className="mt-4 text-sm leading-7 text-ink/70 dark:text-white/70">We care about how a fragrance lands in the room, how it settles over time, and how it feels when it becomes part of someone’s routine. That lens keeps the collection focused and the service human.</p>
						<div className="mt-6 grid gap-3 sm:grid-cols-2">
							{['Sampling', 'Gift guidance', 'Occasion edits', 'Signature discovery'].map((item) => (
								<div key={item} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-white/80">{item}</div>
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
