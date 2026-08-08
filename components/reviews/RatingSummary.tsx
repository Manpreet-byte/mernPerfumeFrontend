'use client';

import { RatingStars } from './RatingStars';

type Breakdown = { rating: number; count: number };

type RatingSummaryProps = {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Breakdown[];
};

export function RatingSummary({ averageRating, totalReviews, ratingBreakdown }: RatingSummaryProps) {
  return (
    <section className="luxury-panel rounded-3xl p-6">
      <p className="eyebrow">Customer voice</p>
      <div className="mt-3 flex items-end gap-4">
        <p className="font-serif text-5xl text-ink dark:text-white">{averageRating.toFixed(1)}</p>
        <div>
          <RatingStars rating={averageRating} />
          <p className="mt-2 text-sm text-stone-300">{totalReviews} reviews</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {ratingBreakdown.map((item) => {
          const width = totalReviews ? `${(item.count / totalReviews) * 100}%` : '0%';
          return (
            <div key={item.rating} className="grid grid-cols-[42px_1fr_24px] items-center gap-3 text-sm text-stone-300">
              <span>{item.rating} star</span>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gold" style={{ width }} />
              </div>
              <span>{item.count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}