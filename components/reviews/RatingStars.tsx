'use client';

import { Star } from 'lucide-react';

type RatingStarsProps = {
  rating: number;
  size?: number;
};

export function RatingStars({ rating, size = 16 }: RatingStarsProps) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} className={index < rounded ? 'fill-gold text-gold' : 'text-stone-600'} />
      ))}
    </span>
  );
}
