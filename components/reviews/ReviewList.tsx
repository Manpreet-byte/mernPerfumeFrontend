'use client';

import { ReviewCard } from './ReviewCard';
import type { Review } from '@/store/types';

type ReviewListProps = {
  reviews: Review[];
  currentUserId?: string;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
};

export function ReviewList({ reviews, currentUserId, onEdit, onDelete }: ReviewListProps) {
  if (!reviews.length) {
    return (
      <div className="luxury-panel rounded-3xl p-8 text-center">
        <h3 className="font-serif text-2xl text-ink dark:text-white">No reviews yet</h3>
        <p className="mt-2 text-stone-300">Be the first to share your impression of this fragrance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          canManage={Boolean(currentUserId && review.user?._id === currentUserId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
