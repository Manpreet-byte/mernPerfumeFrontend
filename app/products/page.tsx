'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { api } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSuggestions, fetchProducts, fetchSearchSuggestions, type ProductQuery } from '@/store/slices/productSlice';
import type { Product } from '@/store/types';

type Category = { _id: string; name: string; slug: string };

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'best_sellers', label: 'Best Sellers' },
] as const;

const PRICE_MIN = 0;
const PRICE_MAX = 5000;
const DEFAULT_LIMIT = 12;

const parseParams = (params: URLSearchParams) => ({
  search: params.get('search') || '',
  category: params.get('category') || (params.get('gender')?.toLowerCase() === 'luxury' ? 'luxury' : ''),
  brand: params.get('brand') || '',
  gender: ['men', 'women', 'unisex'].includes((params.get('gender') || '').toLowerCase()) ? params.get('gender') || '' : '',
  minPrice: Number(params.get('minPrice') || PRICE_MIN),
  maxPrice: Number(params.get('maxPrice') || PRICE_MAX),
  rating: Number(params.get('rating') || 0),
  fragranceNotes: params.get('fragranceNotes') ? params.get('fragranceNotes')!.split(',').filter(Boolean) : [],
  sort: (params.get('sort') || 'newest') as ProductQuery['sort'],
  page: Math.max(Number(params.get('page') || 1), 1),
  limit: Math.max(Number(params.get('limit') || DEFAULT_LIMIT), 1),
});

function ProductSkeleton() {
  return <div className="animate-pulse"><div className="aspect-[.78] rounded-2xl bg-black/5 dark:bg-white/10" /><div className="mt-4 h-3 w-2/5 rounded bg-black/5 dark:bg-white/10" /><div className="mt-3 h-4 w-4/5 rounded bg-black/5 dark:bg-white/10" /><div className="mt-4 h-3 w-1/2 rounded bg-black/5 dark:bg-white/10" /></div>;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading, totalProducts, currentPage, totalPages, hasNextPage, hasPreviousPage, suggestions } = useAppSelector((state) => state.products);

  const initial = useMemo(() => parseParams(searchParams ?? new URLSearchParams()), [searchParams]);
  const [searchInput, setSearchInput] = useState(initial.search);
  const [category, setCategory] = useState(initial.category);
  const [brand, setBrand] = useState(initial.brand);
  const [gender, setGender] = useState(initial.gender);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [rating, setRating] = useState(initial.rating);
  const [notes, setNotes] = useState<string[]>(initial.fragranceNotes);
  const [sort, setSort] = useState<ProductQuery['sort']>(initial.sort || 'newest');
  const [page, setPage] = useState(initial.page);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [allNotes, setAllNotes] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(initial.search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, brand, gender, minPrice, maxPrice, rating, notes.join(','), sort]);

  useEffect(() => {
    api.get('/categories').then((response) => setCategories(response.data || [])).catch(() => setCategories([]));
    api.get('/products?limit=60&page=1').then((response) => {
      const rows: Product[] = response.data.products || [];
      setAllBrands(Array.from(new Set(rows.map((item) => item.brand))).sort((a, b) => a.localeCompare(b)));
      setAllNotes(Array.from(new Set(rows.flatMap((item) => item.fragranceNotes || []))).sort((a, b) => a.localeCompare(b)));
    }).catch(() => {
      setAllBrands([]);
      setAllNotes([]);
    });
  }, []);

  useEffect(() => {
    const query: ProductQuery = {
      search: debouncedSearch || undefined,
      category: category || undefined,
      brand: brand || undefined,
      gender: gender || undefined,
      minPrice,
      maxPrice,
      rating: rating || undefined,
      fragranceNotes: notes.length ? notes : undefined,
      sort,
      page,
      limit: DEFAULT_LIMIT,
    };

    dispatch(fetchProducts(query));

    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.category) params.set('category', query.category);
    if (query.brand) params.set('brand', query.brand);
    if (query.gender) params.set('gender', query.gender);
    if (query.minPrice && query.minPrice !== PRICE_MIN) params.set('minPrice', String(query.minPrice));
    if (query.maxPrice && query.maxPrice !== PRICE_MAX) params.set('maxPrice', String(query.maxPrice));
    if (query.rating) params.set('rating', String(query.rating));
    if (query.fragranceNotes?.length) params.set('fragranceNotes', query.fragranceNotes.join(','));
    if (query.sort && query.sort !== 'newest') params.set('sort', query.sort);
    if (query.page && query.page > 1) params.set('page', String(query.page));
    params.set('limit', String(DEFAULT_LIMIT));
    router.replace(`/products${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [debouncedSearch, category, brand, gender, minPrice, maxPrice, rating, notes, sort, page, dispatch, router]);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      dispatch(clearSuggestions());
      return;
    }
    dispatch(fetchSearchSuggestions(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const toggleNote = (value: string) => {
    setNotes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setCategory('');
    setBrand('');
    setGender('');
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setRating(0);
    setNotes([]);
    setSort('newest');
    setPage(1);
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="luxury-label">Category</h3>
        <select className="luxury-input luxury-select mt-2" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item._id} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      <div>
        <h3 className="luxury-label">Brand</h3>
        <select className="luxury-input luxury-select mt-2" value={brand} onChange={(event) => setBrand(event.target.value)}>
          <option value="">All brands</option>
          {allBrands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div>
        <h3 className="luxury-label">Gender</h3>
        <select className="luxury-input luxury-select mt-2" value={gender} onChange={(event) => setGender(event.target.value)}>
          <option value="">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>
      <div>
        <h3 className="luxury-label">Price range</h3>
        <div className="mt-4 space-y-3">
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={minPrice} onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice - 50))} className="w-full accent-gold" />
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={maxPrice} onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice + 50))} className="w-full accent-gold" />
          <p className="text-sm text-stone-600 dark:text-stone-300">${minPrice} - ${maxPrice}</p>
        </div>
      </div>
      <div>
        <h3 className="luxury-label">Rating</h3>
        <select className="luxury-input luxury-select mt-2" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          <option value={0}>All ratings</option>
          <option value={4.5}>4.5 and above</option>
          <option value={4}>4 and above</option>
          <option value={3}>3 and above</option>
        </select>
      </div>
      <div>
        <h3 className="luxury-label">Fragrance notes</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {allNotes.slice(0, 16).map((note) => (
            <button key={note} onClick={() => toggleNote(note)} className={`rounded-full border px-3 py-1 text-xs transition-colors ${notes.includes(note) ? 'border-gold bg-gold/10 text-gold dark:bg-gold/20' : 'border-black/10 text-stone-600 hover:border-black/20 dark:border-white/15 dark:text-stone-300 dark:hover:border-white/30'}`}>
              {note}
            </button>
          ))}
        </div>
      </div>
      <button onClick={clearAllFilters} className="button-outline w-full">Clear all filters</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 text-ink dark:text-white md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">The collection</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Find your fragrance</h1>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="button-outline md:hidden"><Filter size={14} className="mr-2" /> Filters</button>
      </div>

      <div className="relative mt-8">
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <Search size={16} className="text-stone-500 dark:text-stone-300" />
          <input
            value={searchInput}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={() => setTimeout(() => setSuggestionsOpen(false), 120)}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search by perfume name, brand, or notes"
          />
          {searchInput && <button onClick={() => setSearchInput('')} className="text-stone-500 dark:text-stone-400"><X size={15} /></button>}
        </div>
        {suggestionsOpen && suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-luxe dark:border-white/10 dark:bg-[#0f0d0b]">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchInput(suggestion);
                  setSuggestionsOpen(false);
                }}
                className="block w-full border-b border-black/5 px-4 py-3 text-left text-sm text-stone-700 last:border-0 hover:bg-black/5 dark:border-white/5 dark:text-stone-200 dark:hover:bg-white/5"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[280px_1fr]">
        <aside className="luxury-panel hidden h-fit rounded-3xl p-5 lg:block">{filterPanel}</aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-600 dark:text-stone-300">{loading ? 'Discovering scents…' : `${totalProducts} fragrances found`}</p>
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 dark:border-white/10 dark:bg-white/5">
              <SlidersHorizontal size={15} />
              <select className="luxury-select bg-transparent text-sm outline-none" value={sort} onChange={(event) => setSort(event.target.value as ProductQuery['sort'])}>
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="luxury-panel rounded-3xl p-10 text-center">
              <h2 className="font-serif text-3xl">No fragrances found</h2>
              <p className="mt-3 text-stone-600 dark:text-stone-300">Try adjusting your filters or clearing all options.</p>
              <button onClick={clearAllFilters} className="button-gold mt-6">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
              <div className="mt-10 flex items-center justify-center gap-3">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={!hasPreviousPage} className="button-outline disabled:opacity-40">Previous</button>
                <span className="text-sm text-stone-600 dark:text-stone-300">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setPage((prev) => prev + 1)} disabled={!hasNextPage} className="button-outline disabled:opacity-40">Next</button>
              </div>
            </>
          )}
        </section>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-sm overflow-y-auto border-l border-white/10 bg-[#0f0d0b] p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Filters</h2>
              <button onClick={() => setDrawerOpen(false)}><X /></button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </div>
  );
}