'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist } from '@/store/slices/wishlistSlice';
import { fetchProduct } from '@/store/slices/productSlice';
import { api } from '@/services/api';
import type { Product, Review } from '@/store/types';
import { demoProducts } from '@/hooks/use-products';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';

type ReviewResponse = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Array<{ rating: number; count: number }>;
};

const emptySummary: ReviewResponse = {
  reviews: [],
  averageRating: 0,
  totalReviews: 0,
  ratingBreakdown: [
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ],
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.products.product);
  const loading = useAppSelector((state) => state.products.productLoading);
  const user = useAppSelector((state) => state.auth.user);
  const [image, setImage] = useState(0);
  const [summary, setSummary] = useState<ReviewResponse>(emptySummary);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setSummary({ ...emptySummary, ...data });
    } catch {
      setSummary(emptySummary);
    }
  };

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProduct(id));
    loadReviews();
  }, [dispatch, id]);

  const displayed = useMemo(() => product ?? demoProducts.find((item) => item._id === id) ?? demoProducts[0], [product, id]);
  const myReview = summary.reviews.find((review) => review.user?._id === user?.id);

  const handleSubmitReview = async (payload: { rating: number; comment: string }) => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, payload);
      } else {
        await api.post(`/reviews/${id}`, payload);
      }
      setEditingReview(null);
      await loadReviews();
    } catch (error: any) {
      setReviewError(error?.response?.data?.message || 'Unable to submit review right now.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      if (editingReview?._id === reviewId) setEditingReview(null);
      await loadReviews();
    } catch {
      setReviewError('Unable to delete review right now.');
    }
  };

  if (loading && !displayed) return <div className="p-20 text-center text-ink dark:text-white">Loading fragrance…</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-ink dark:text-white">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <img src={displayed.images[image]} alt={displayed.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {displayed.images.map((src, index) => (
              <button key={src} onClick={() => setImage(index)} className={`h-20 w-16 overflow-hidden rounded-xl border ${index === image ? 'border-gold' : 'border-white/10'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:py-6">
          <p className="eyebrow">{displayed.brand}</p>
          <h1 className="mt-3 font-serif text-5xl">{displayed.name}</h1>
          <p className="mt-4 text-sm text-stone-300">{summary.averageRating.toFixed(1)} average rating · {summary.totalReviews} reviews</p>
          <p className="mt-6 text-2xl font-medium">${displayed.discountPrice || displayed.price} <span className="ml-2 text-sm font-normal text-stone-400">{displayed.volume}</span></p>
          <div className="gold-line my-7" />
          <p className="leading-7 text-stone-300">{displayed.description}</p>
          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-widest">Notes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {displayed.fragranceNotes.map((note) => <span key={note} className="border border-gold/50 px-3 py-1 text-xs">{note}</span>)}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={() => dispatch(addToCart({ product: displayed as Product, quantity: 1 }))} className="button-gold">Add to bag</button>
            <button onClick={() => dispatch(addToWishlist(displayed as Product))} className="button-outline">Save to wishlist</button>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[320px_1fr]">
        <RatingSummary averageRating={summary.averageRating} totalReviews={summary.totalReviews} ratingBreakdown={summary.ratingBreakdown} />
        <div className="space-y-6">
          {!user ? (
            <div className="luxury-panel rounded-3xl p-6">
              <h3 className="font-serif text-2xl">Write a review</h3>
              <p className="mt-2 text-stone-300">Please sign in to share your perfume experience.</p>
              <Link href="/login" className="button-gold mt-5">Sign in</Link>
            </div>
          ) : (
            <ReviewForm loading={reviewLoading} initialReview={editingReview || null} onSubmit={handleSubmitReview} onCancelEdit={() => setEditingReview(null)} />
          )}

          {reviewError && <p className="rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{reviewError}</p>}

          <ReviewList
            reviews={summary.reviews}
            currentUserId={user?.id}
            onEdit={(review) => setEditingReview(review)}
            onDelete={handleDeleteReview}
          />

          {myReview && !editingReview && (
            <p className="text-xs uppercase tracking-[.2em] text-stone-400">You can edit or delete your review anytime.</p>
          )}
        </div>
      </div>
    </div>
  );
}