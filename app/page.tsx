'use client';

import Link from 'next/link';
import { ArrowRight, Clock3, Sparkles, Star, WandSparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { useProducts } from '@/hooks/use-products';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import type { Product } from '@/store/types';

const categories = [
  { name: 'For Her', gender: 'women', image: 'https://www.lightxeditor.com/blog/wp-content/uploads/2026/01/image21.webp' },
  { name: 'For Him', gender: 'men', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85' },
  { name: 'Unisex', gender: 'unisex', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=85' },
  { name: 'Haute Parfumerie', category: 'luxury', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85' },
];

const houseValues = [
  { title: 'Rare compositions', copy: 'A tight edit of perfumes chosen for depth, balance, and lasting presence.', icon: Sparkles },
  { title: 'Concierge service', copy: 'Personal recommendations, thoughtful gifting, and guided discovery.', icon: WandSparkles },
  { title: 'Trusted quality', copy: 'Premium curation with careful sourcing and elegant presentation.', icon: ShieldCheck },
];

const rituals = [
  'Morning lift',
  'Boardroom confidence',
  'Evening signature',
  'Gift-worthy indulgence',
];

const housePillars = [
  { title: 'Editorial curation', copy: 'We curate by feeling, longevity, and composition rather than chasing volume.', icon: Sparkles },
  { title: 'Concierge service', copy: 'Advice, gifting support, and recommendation flows that feel personal.', icon: WandSparkles },
  { title: 'Trusted standards', copy: 'Materials, sourcing, and packaging are all selected to feel considered.', icon: ShieldCheck },
];

const journalEntries = [
  { title: 'Layer with intent', copy: 'How to pair a clean citrus with a warm base for a more dimensional signature.' },
  { title: 'Gift by mood', copy: 'Choose according to how you want someone to feel, not just the notes on the box.' },
  { title: 'Seasonal rotation', copy: 'A small wardrobe of scents can keep fragrance feeling fresh across the year.' },
];

const serviceNotes = [
  'Private consultation',
  'Gift wrapping included',
  'Sample-friendly discovery',
  'Seasonal edits',
];

export default function Home() {
  const { products } = useProducts();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <>
      <section className="relative min-h-[72vh] overflow-hidden bg-stone-100 sm:min-h-[82vh] dark:bg-ink">
        <img src="https://www.lightxeditor.com/blog/wp-content/uploads/2026/01/image4-1.webp" alt="Premium luxury perfume in elegant setting" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/20 dark:from-black/85 dark:via-black/45 dark:to-transparent" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto grid min-h-[72vh] max-w-7xl gap-10 px-6 py-12 sm:min-h-[82vh] sm:py-0 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="max-w-xl text-ink dark:text-white">
            <p className="eyebrow text-ink/70 dark:text-white/80">The art of presence</p>
            <h1 className="mt-5 max-w-[12ch] font-serif text-4xl leading-[.95] sm:text-5xl md:text-7xl">Leave a beautiful trace.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-ink/75 dark:text-stone-200 sm:text-base">Exceptional perfume, selected for the moments that deserve to be remembered.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="button-gold">Discover the collection <ArrowRight className="ml-2" size={15} /></Link>
              <Link href="/about" className="button-outline border-black/10 text-ink hover:border-gold hover:text-gold dark:border-white/15 dark:text-white">Our house</Link>
            </div>
            <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
              {['Extrait quality', 'Luxury gifting', 'Curated drops'].map((item) => (
                <div key={item} className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-center text-[10px] uppercase tracking-[.18em] text-ink backdrop-blur sm:text-xs sm:text-left dark:border-white/10 dark:bg-white/5 dark:text-stone-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="luxury-panel overflow-hidden rounded-[2rem] border border-black/10 bg-white/85 p-5 text-ink backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/10 dark:text-white">
              <p className="eyebrow text-ink/70 dark:text-gold/90">House note</p>
              <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight sm:text-4xl">A scent wardrobe built for the way you actually live.</h2>
              <p className="mt-4 text-sm leading-7 text-ink/75 dark:text-stone-200">Our collection balances intimacy, projection, and longevity so every bottle feels useful, beautiful, and memorable.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white/90 p-4 dark:border-white/10 dark:bg-white/10">
                  <p className="text-xs uppercase tracking-[.18em] text-ink/60 dark:text-stone-300">New edit</p>
                  <p className="mt-2 font-serif text-2xl">Curated weekly</p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-white/90 p-4 dark:border-white/10 dark:bg-white/10">
                  <p className="text-xs uppercase tracking-[.18em] text-ink/60 dark:text-stone-300">Concierge</p>
                  <p className="mt-2 font-serif text-2xl">Guided support</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: '42+', label: 'fragrance stories' },
                { value: '24h', label: 'concierge response' },
                { value: '5★', label: 'curation mindset' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-black/10 bg-white/85 p-4 text-ink backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white">
                  <p className="font-serif text-2xl sm:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.22em] text-ink/60 dark:text-stone-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {houseValues.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="luxury-panel animate-fade-in rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold"><Icon size={18} /></span>
                  <h3 className="font-serif text-2xl">{value.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/70 dark:text-white/70">{value.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Premium Featured Fragrances Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="Exclusive drops" title="This month's most coveted scents" copy="Hand-selected rare compositions that capture the essence of luxury." />
        <div className="grid gap-8 md:grid-cols-3">
          {products.slice(0, 3).map((product: Product, idx: number) => (
            <div key={product._id} className="luxury-panel group overflow-hidden rounded-3xl transition hover:border-gold/50">
              <div className="relative overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="h-80 w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute right-4 top-4">
                  <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-gold border border-gold/40">#{idx + 1} Pick</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-ink dark:text-white">{product.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">{product.fragranceNotes.join(', ')}</p>
                <p className="mt-4 font-serif text-xl font-semibold text-gold">${product.price}</p>
                <button onClick={() => handleAddToCart(product)} className="button-gold mt-5 w-full">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-ink via-ink to-black px-6 py-20 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(183,147,78,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(183,147,78,0.08),transparent_30%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="eyebrow">Why choose Aurelia</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Crafted for the discerning nose</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '✓', title: 'Luxury Curation', desc: '42+ carefully selected fragrances' },
              { icon: '◆', title: 'Expert Concierge', desc: '24-hour personalized support' },
              { icon: '★', title: 'Premium Quality', desc: 'Sourced from master perfumers' },
              { icon: '⚜', title: 'Complimentary Delivery', desc: 'Luxury packaging included' },
            ].map((benefit, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="text-3xl text-gold mb-3">{benefit.icon}</div>
                <h3 className="font-serif text-lg">{benefit.title}</h3>
                <p className="mt-2 text-sm text-stone-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">Customer favorites</p>
            <h2 className="mt-3 font-serif text-4xl">Best sellers of the season</h2>
          </div>
          <Link href="/products" className="button-gold gap-2">
            See all fragrances <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product: Product, idx: number) => (
            <div key={product._id} className="luxury-panel overflow-hidden rounded-3xl group">
              <div className="relative overflow-hidden h-72">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block rounded-full bg-gold text-ink px-3 py-1 text-xs font-bold uppercase tracking-[.16em]">#{idx + 1} Pick</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">{product.brand}</p>
                <h3 className="mt-2 font-serif text-xl text-ink dark:text-white">{product.name}</h3>
                <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-ink dark:text-white">${product.price}</span>
                  <span className="text-xs text-stone-400">⭐ {product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Gifting Section */}
      <section className="bg-gradient-to-b from-transparent to-gold/5 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Luxury gifting</p>
              <h2 className="mt-3 font-serif text-5xl leading-tight">Give the gift of fragrance</h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-stone-600 dark:text-stone-400">Every Aurelia fragrance arrives in luxury black-and-gold packaging, complete with custom gift wrapping and a personalized message card.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="button-gold">Shop gift sets</Link>
                <Link href="/contact" className="button-outline">Book concierge</Link>
              </div>
            </div>
            <div className="relative">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCC2dUo-hyRIDCXDVG24a-t8RoHw8mZzTgxkM1RGO9jYS4Hs3liKwG3SQS&s=10" alt="Luxury gift wrapped perfumes" className="rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="eyebrow">Loved by fragrance enthusiasts</p>
          <h2 className="mt-3 font-serif text-4xl">Join our community</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { stars: 5, quote: 'The curation is impeccable. Every fragrance tells a story.', author: 'Sarah M.' },
            { stars: 5, quote: 'Best concierge experience I have ever had. Truly personalized.', author: 'James L.' },
            { stars: 5, quote: 'Luxury packaging that feels like opening something precious.', author: 'Emma R.' },
          ].map((review, idx) => (
            <div key={idx} className="luxury-panel rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(review.stars)].map((_, i) => (
                  <span key={i} className="text-gold">★</span>
                ))}
              </div>
              <p className="text-sm leading-7 text-ink/70 dark:text-white/70 italic">"{review.quote}"</p>
              <p className="mt-4 font-semibold text-ink dark:text-white">— {review.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading eyebrow="Why Aurelia" title="A quieter kind of luxury" copy="The brand is designed to feel editorial, personal, and calm rather than loud or overbuilt." />
        <div className="grid gap-6 md:grid-cols-3">
          {housePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="luxury-panel rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold"><Icon size={18} /></span>
                  <h3 className="font-serif text-2xl">{pillar.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/70 dark:text-white/70">{pillar.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream px-6 py-20 dark:bg-ink/50">
        <img src="https://img.magnific.com/free-photo/front-view-perfume-bottle-flowers-beige-blurred-background-free-space_140725-145507.jpg?semt=ais_test_b&w=740&q=80" alt="Perfume with flowers background" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/75 dark:from-black/90 dark:via-black/85 dark:to-black/80" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Curated for you</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Icons of the house</h2>
            <p className="mt-4 mx-auto max-w-2xl text-base leading-7 text-ink/70 dark:text-white/70">A thoughtful selection of scents with undeniable character. Each fragrance in our iconic collection tells a story of craftsmanship, heritage, and timeless elegance.</p>

            <div className="mt-6 flex items-center justify-center gap-4 sm:justify-start">
              {products.slice(0, 4).map((p: Product) => (
                <Link key={p._id} href={`/products/${p._id}`} className="group relative block">
                  <img src={p.images[0]} alt={p.name} className="h-24 w-24 rounded-full object-cover ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="mb-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">{p.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-3">
              <Star size={16} className="text-gold" />
              <span className="text-xs uppercase tracking-[.18em] font-semibold text-ink dark:text-white">Bestselling fragrances</span>
            </div>
            <div className="luxury-panel flex items-center gap-3 rounded-full px-4 py-3 text-xs uppercase tracking-[.2em] text-ink/70 dark:text-white/70">
              <Star size={14} className="text-gold" />
              New edit available now
            </div>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product: Product) => <ProductCard key={product._id} product={product} />)}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm leading-7 text-ink/60 dark:text-white/60">Discover the complete collection and find your signature scent</p>
            <Link href="/products" className="button-gold mt-6 inline-flex">
              Explore all icons <ArrowRight className="ml-2" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <SectionHeading eyebrow="Find your signature" title="A scent for every self" />
            <div className="grid gap-3 sm:grid-cols-2">
              {rituals.map((ritual) => (
                <div key={ritual} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-stone-100 backdrop-blur">
                  {ritual}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.name} href={category.category ? `/products?category=${category.category}` : `/products?gender=${category.gender}`} className="group relative h-80 overflow-hidden rounded-3xl border border-white/10 animate-pop">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-2xl">{category.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[.2em] text-stone-300">Explore the edit</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="The Aurelia ritual" title="Scent is a quiet kind of power." copy="We believe fragrance is deeply personal. Let our edit guide you toward the one that feels like you." />
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceNotes.map((note) => (
                <div key={note} className="luxury-panel rounded-3xl p-5">
                  <p className="eyebrow">House service</p>
                  <p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">{note}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="button-outline mt-6">Our philosophy</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85" alt="Perfume ritual" className="h-[260px] w-full object-cover sm:h-[320px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="eyebrow text-gold/90">Private ritual</p>
                <p className="mt-2 max-w-sm font-serif text-3xl leading-tight">A scent should feel like a signature, not a trend.</p>
              </div>
            </div>

            <div className="luxury-panel grid gap-4 rounded-[2rem] p-6">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold"><Clock3 size={24} /></div>
              <div>
                <p className="eyebrow">Always evolving</p>
                <p className="mt-3 text-sm leading-7 text-ink/70 dark:text-white/70">Editorial drops, seasonal edits, and guided discovery keep the house feeling fresh while preserving the same refined point of view.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <SectionHeading eyebrow="The Aurelia ritual" title="Scent is a quiet kind of power." copy="We believe fragrance is deeply personal. Let our edit guide you toward the one that feels like you." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">Private consultation</p>
              <p className="mt-3 text-sm leading-7">Tailored fragrance advice for gifting, daily wear, and signature scent building.</p>
            </div>
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">Concierge care</p>
              <p className="mt-3 text-sm leading-7">A polished, luxury-led experience from discovery to delivery.</p>
            </div>
          </div>
          <Link href="/about" className="button-outline mt-3">Our philosophy</Link>
        </div>
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85" alt="Perfume ritual" className="h-[320px] w-full object-cover sm:h-[430px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="luxury-panel grid gap-6 rounded-[2rem] p-8 md:grid-cols-[1.3fr_.7fr] md:items-center">
          <div>
            <p className="eyebrow">Private journal</p>
            <h2 className="mt-3 font-serif text-4xl">Notes from the atelier.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70 dark:text-white/70">Editorial stories, scent pairing ideas, and seasonal launches designed to make the project feel more premium and alive.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {journalEntries.map((entry) => (
              <div key={entry.title} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-4 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <p className="eyebrow">Journal</p>
                <p className="mt-3 font-serif text-xl text-ink dark:text-white">{entry.title}</p>
                <p className="mt-2 leading-7 text-ink/70 dark:text-white/70">{entry.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}