'use client';

type DiscountSummaryProps = {
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string | null;
};

const money = (value: number) => `₹${value.toFixed(2)}`;

export function DiscountSummary({ subtotal, discountAmount, finalAmount, couponCode }: DiscountSummaryProps) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Order summary</p>
          <h2 className="mt-2 font-serif text-2xl text-ink dark:text-white">Price breakdown</h2>
        </div>
        {couponCode ? <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-gold">{couponCode}</span> : null}
      </div>

      <div className="mt-5 space-y-3 text-sm text-ink/70 dark:text-stone-300">
        <div className="flex items-center justify-between">
          <span>Original price</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-300">
          <span>Discount amount</span>
          <span>-{money(discountAmount)}</span>
        </div>
        <div className="gold-line my-4" />
        <div className="flex items-center justify-between text-base font-semibold text-ink dark:text-white">
          <span>Final price</span>
          <span>{money(finalAmount)}</span>
        </div>
      </div>
    </section>
  );
}