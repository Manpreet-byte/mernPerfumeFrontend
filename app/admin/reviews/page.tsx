'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { DataTable, type Column } from '../_components/data-table';
import { PageHeading } from '../_components/page-heading';

type AdminReview = {
  _id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { _id: string; name: string; email: string };
  product: { _id: string; name: string; slug: string };
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const products = useMemo(() => Array.from(new Set(reviews.map((review) => review.product.slug))).sort(), [reviews]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ ...(search && { search }), ...(rating && { rating }), ...(product && { product }) }).toString();
      const { data } = await api.get(`/admin/reviews${query ? `?${query}` : ''}`);
      setReviews(data || []);
    } catch {
      setMessage('Unable to load reviews right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews();
    }, 450);
    return () => clearTimeout(timer);
  }, [search, rating, product]);

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/reviews/${id}/status`, { status });
      setMessage(`Review ${status}.`);
      await loadReviews();
    } catch {
      setMessage('Unable to update review status.');
    }
  };

  const removeReview = async (id: string) => {
    try {
      await api.delete(`/admin/reviews/${id}`);
      setMessage('Review deleted.');
      await loadReviews();
    } catch {
      setMessage('Unable to delete review.');
    }
  };

  const columns: Column<AdminReview>[] = [
    {
      label: 'Review',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-semibold text-white">{row.product.name}</p>
          <p className="mt-1 text-xs text-stone-300">{row.comment}</p>
        </div>
      ),
    },
    {
      label: 'Customer',
      render: (row) => (
        <div>
          <p className="text-white">{row.user.name}</p>
          <p className="mt-1 text-xs text-stone-400">{row.user.email}</p>
        </div>
      ),
    },
    {
      label: 'Rating',
      render: (row) => (
        <span className="flex gap-0.5 text-gold">{Array.from({ length: row.rating }, (_, index) => <Star key={index} size={14} className="fill-gold" />)}</span>
      ),
    },
    {
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs ${row.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {row.isApproved ? 'Approved' : 'Rejected'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeading title="Reviews" description="Moderate customer feedback and keep the review experience premium." />
      <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-black/30 p-4 md:grid-cols-4">
        <label className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search review text" className="luxury-input pl-9" />
        </label>
        <select value={rating} onChange={(event) => setRating(event.target.value)} className="luxury-input">
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
        <select value={product} onChange={(event) => setProduct(event.target.value)} className="luxury-input">
          <option value="">All products</option>
          {products.map((slug) => <option key={slug} value={slug}>{slug}</option>)}
        </select>
        <button onClick={() => { setSearch(''); setRating(''); setProduct(''); }} className="button-outline">Clear filters</button>
      </div>
      {message && <p className="mt-4 text-sm text-gold">{message}</p>}
      {loading && <p className="mt-4 text-sm text-stone-300">Loading reviews…</p>}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={reviews.map((review) => ({ ...review, id: review._id }))}
          pageSize={8}
          renderActions={(row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => setStatus(row._id, 'approved')} className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">Approve</button>
              <button onClick={() => setStatus(row._id, 'rejected')} className="rounded-full border border-amber-400/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">Reject</button>
              <button onClick={() => removeReview(row._id)} className="text-red-300" aria-label="Delete review"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>
    </div>
  );
}