'use client';

import { type ReactNode } from 'react';
import { DataTable, type Column } from '../_components/data-table';
import type { Coupon } from '@/store/types';

const statusClass: Record<Coupon['status'], string> = {
	active: 'bg-emerald-100 text-emerald-800',
	inactive: 'bg-stone-200 text-stone-700',
	expired: 'bg-red-100 text-red-800',
	scheduled: 'bg-blue-100 text-blue-800',
};

export function CouponTable({ coupons, onEdit, onDelete, onToggle }: { coupons: Coupon[]; onEdit: (coupon: Coupon) => void; onDelete: (coupon: Coupon) => void; onToggle: (coupon: Coupon) => void }) {
	const columns: Column<Coupon>[] = [
		{ label: 'Coupon', render: (row) => <div><p className="font-semibold text-ink dark:text-white">{row.code}</p><p className="mt-1 max-w-sm text-xs text-ink/50 dark:text-white/50">{row.description}</p></div> },
		{ label: 'Discount', render: (row) => <p>{row.discountType === 'percentage' ? `${row.discountValue}%` : `₹${row.discountValue.toFixed(2)}`}{row.maximumDiscount != null ? <span className="ml-2 text-xs text-gold">cap ₹{row.maximumDiscount.toFixed(2)}</span> : null}</p> },
		{ label: 'Validity', render: (row) => <div><p className="font-medium">{new Date(row.startDate).toLocaleDateString()} → {new Date(row.expiryDate).toLocaleDateString()}</p><p className="mt-1 text-xs text-ink/50 dark:text-white/50">Min spend ₹{row.minimumPurchaseAmount.toFixed(2)}</p></div> },
		{ label: 'Usage', render: (row) => <p>{row.usedCount} / {row.usageLimit}</p> },
		{ label: 'Status', render: (row) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[row.status]}`}>{row.status}</span> },
	];

	const renderActions = (row: Coupon): ReactNode => (
		<div className="flex flex-wrap justify-end gap-2">
			<button type="button" onClick={() => onEdit(row)} className="rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold/10">Edit</button>
			<button type="button" onClick={() => onToggle(row)} className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-stone-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10">{row.isActive ? 'Deactivate' : 'Activate'}</button>
			<button type="button" onClick={() => onDelete(row)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50">Delete</button>
		</div>
	);

	return <DataTable columns={columns} rows={coupons} renderActions={renderActions} />;
}