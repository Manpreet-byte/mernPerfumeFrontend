'use client';

import { useMemo } from 'react';
import { RatingStars } from './RatingStars';
import type { Review } from '@/store/types';

type ReviewCardProps = {
  review: Review;
  canManage: boolean;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
};

export function ReviewCard({ review, canManage, onEdit, onDelete }: ReviewCardProps) {
  const dateLabel = useMemo(() => new Date(review.updatedAt || review.createdAt).toLocaleDateString(), [review.updatedAt, review.createdAt]);

  return (
    <article className="luxury-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-xl text-ink dark:text-white">{review.user?.name || 'Anonymous customer'}</p>
          <p className="mt-1 text-xs uppercase tracking-[.2em] text-stone-400">{dateLabel}</p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="mt-4 leading-7 text-stone-300">{review.comment}</p>
      {canManage && (
        <div className="mt-5 flex gap-3">
          <button onClick={() => onEdit(review)} className="button-outline">Edit</button>
          <button onClick={() => onDelete(review._id)} className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-300">Delete</button>
        </div>
      )}
    </article>
  );
}
