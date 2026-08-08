'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { api } from '@/services/api';
import type { Coupon, CouponFormValues } from '@/store/types';
import { PageHeading } from '../_components/page-heading';
import { CouponForm } from './CouponForm';
import { CouponTable } from './CouponTable';

const filters = ['all', 'active', 'expired', 'inactive'] as const;

const toPayload = (values: CouponFormValues) => ({
	code: values.code.trim().toUpperCase(),
	description: values.description.trim(),
	discountType: values.discountType,
	discountValue: values.discountValue,
	minimumPurchaseAmount: values.minimumPurchaseAmount,
	maximumDiscount: values.maximumDiscount,
	usageLimit: values.usageLimit,
	usedCount: values.usedCount,
	startDate: values.startDate,
	expiryDate: values.expiryDate,
	isActive: values.isActive,
});

export default function CouponsPage() {
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<(typeof filters)[number]>('all');
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const loadCoupons = useCallback(async () => {
		try {
			const { data } = await api.get<Coupon[]>('/admin/coupons', { params: { search: search || undefined, status } });
			setCoupons(data);
		} catch {
			setCoupons([]);
			setMessage('Unable to load coupons right now.');
		}
	}, [search, status]);

	useEffect(() => {
		const timer = setTimeout(() => { void loadCoupons(); }, 250);
		return () => clearTimeout(timer);
	}, [loadCoupons]);

	const stats = useMemo(() => ({
		total: coupons.length,
		active: coupons.filter((coupon) => coupon.status === 'active').length,
		expired: coupons.filter((coupon) => coupon.status === 'expired').length,
	}), [coupons]);

	const saveCoupon = async (values: CouponFormValues) => {
		setLoading(true);
		setMessage('');
		try {
			const payload = toPayload(values);
			if (selectedCoupon) await api.put(`/admin/coupons/${selectedCoupon.id}`, payload);
			else await api.post('/admin/coupons', payload);
			setMessage(selectedCoupon ? 'Coupon updated successfully.' : 'Coupon created successfully.');
			setSelectedCoupon(null);
			await loadCoupons();
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Unable to save coupon.');
		} finally {
			setLoading(false);
		}
	};

	const deleteCoupon = async (coupon: Coupon) => {
		if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
		setLoading(true);
		try {
			await api.delete(`/admin/coupons/${coupon.id}`);
			setMessage('Coupon deleted.');
			if (selectedCoupon?.id === coupon.id) setSelectedCoupon(null);
			await loadCoupons();
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Unable to delete coupon.');
		} finally {
			setLoading(false);
		}
	};

	const toggleCoupon = async (coupon: Coupon) => {
		setLoading(true);
		try {
			await api.put(`/admin/coupons/${coupon.id}`, toPayload({
				code: coupon.code,
				description: coupon.description,
				discountType: coupon.discountType,
				discountValue: coupon.discountValue,
				minimumPurchaseAmount: coupon.minimumPurchaseAmount,
				maximumDiscount: coupon.maximumDiscount,
				usageLimit: coupon.usageLimit,
				usedCount: coupon.usedCount,
				startDate: coupon.startDate.slice(0, 10),
				expiryDate: coupon.expiryDate.slice(0, 10),
				isActive: !coupon.isActive,
			}));
			await loadCoupons();
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Unable to update coupon state.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<PageHeading
				eyebrow="Aurelia promotions"
				title="Coupon management"
				description="Create, schedule, and monitor luxury offers that move fragrance inventory with precision."
				action={<button onClick={() => setSelectedCoupon(null)} className="button-gold"><Plus className="mr-2" size={15} />New coupon</button>}
			/>

			<div className="mt-8 grid gap-4 sm:grid-cols-3">
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">All coupons</p><p className="mt-2 font-serif text-3xl">{stats.total}</p></section>
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">Active</p><p className="mt-2 font-serif text-3xl">{stats.active}</p></section>
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">Expired</p><p className="mt-2 font-serif text-3xl">{stats.expired}</p></section>
			</div>

			{message && <p className="mt-5 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-dark">{message}</p>}

			<div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
				<section className="space-y-5">
					<div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-stone-50 px-4 py-3 dark:border-white/10 dark:bg-white/5 lg:max-w-md lg:flex-1">
								<Search size={16} className="text-gold" />
								<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code or description" className="w-full bg-transparent text-sm outline-none" />
							</div>
							<div className="flex flex-wrap gap-2">
								{filters.map((filter) => <button key={filter} onClick={() => setStatus(filter)} className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-widest ${status === filter ? 'border-gold bg-gold text-white' : 'border-ink/15 dark:border-white/15'}`}>{filter}</button>)}
							</div>
						</div>
					</div>
					<CouponTable coupons={coupons} onEdit={setSelectedCoupon} onDelete={deleteCoupon} onToggle={toggleCoupon} />
				</section>

				<CouponForm coupon={selectedCoupon} onSubmit={saveCoupon} submitting={loading} />
			</div>
		</div>
	);
}