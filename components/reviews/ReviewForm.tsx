'use client';

import { useMemo, useState } from 'react';
import { RatingStars } from './RatingStars';
import type { Review } from '@/store/types';

type ReviewFormProps = {
  loading?: boolean;
  initialReview?: Review | null;
  onSubmit: (payload: { rating: number; comment: string }) => Promise<void>;
  onCancelEdit?: () => void;
};

export function ReviewForm({ loading, initialReview, onSubmit, onCancelEdit }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || '');

  const title = useMemo(() => (initialReview ? 'Edit your review' : 'Write a review'), [initialReview]);

  return (
    <section className="luxury-panel rounded-3xl p-6">
      <h3 className="font-serif text-2xl text-ink dark:text-white">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            onClick={() => setRating(index + 1)}
            className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-widest ${rating === index + 1 ? 'border-gold bg-gold/20 text-gold' : 'border-white/15 text-stone-300'}`}
          >
            {index + 1} star
          </button>
        ))}
      </div>
      <div className="mt-3"><RatingStars rating={rating} /></div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="luxury-input mt-4 min-h-28"
        placeholder="Tell other perfume lovers what stood out to you."
      />
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onSubmit({ rating, comment })}
          disabled={loading || !comment.trim()}
          className="button-gold"
        >
          {loading ? 'Saving…' : initialReview ? 'Update review' : 'Submit review'}
        </button>
        {initialReview && onCancelEdit && (
          <button onClick={onCancelEdit} className="button-outline">Cancel</button>
        )}
      </div>
    </section>
  );
}
