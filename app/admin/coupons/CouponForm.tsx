'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Coupon, CouponFormValues } from '@/store/types';
import { Field, inputClass } from '../_components/forms';

const optionalMoney = z.preprocess((value) => value === '' || value == null ? null : Number(value), z.number().nonnegative().nullable());

const couponSchema = z.object({
	code: z.string().trim().min(3, 'Coupon code is required').max(30),
	description: z.string().trim().min(3, 'Describe the coupon').max(200),
	discountType: z.enum(['percentage', 'fixed']),
	discountValue: z.coerce.number().positive('Discount must be greater than zero'),
	minimumPurchaseAmount: z.coerce.number().nonnegative(),
	maximumDiscount: optionalMoney,
	usageLimit: z.coerce.number().int().positive(),
	usedCount: z.coerce.number().int().nonnegative(),
	startDate: z.string().min(1, 'Start date is required'),
	expiryDate: z.string().min(1, 'Expiry date is required'),
	isActive: z.boolean(),
}).refine((values) => new Date(values.expiryDate) > new Date(values.startDate), {
	message: 'Expiry date must be after start date',
	path: ['expiryDate'],
}).refine((values) => values.discountType !== 'percentage' || values.discountValue <= 100, {
	message: 'Percentage discount cannot exceed 100',
	path: ['discountValue'],
});

type CouponFormInput = z.infer<typeof couponSchema>;

const blankValues: CouponFormInput = {
	code: '',
	description: '',
	discountType: 'percentage',
	discountValue: 10,
	minimumPurchaseAmount: 0,
	maximumDiscount: null,
	usageLimit: 1,
	usedCount: 0,
	startDate: new Date().toISOString().slice(0, 10),
	expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
	isActive: true,
};

const moneyOrNull = (value: number | null) => (value == null ? null : Number(value));

export function CouponForm({ coupon, onSubmit, submitting }: { coupon?: Coupon | null; onSubmit: (values: CouponFormValues) => Promise<void>; submitting: boolean }) {
	const form = useForm<CouponFormInput>({ resolver: zodResolver(couponSchema), defaultValues: blankValues });

	useEffect(() => {
		form.reset(coupon ? {
			code: coupon.code,
			description: coupon.description,
			discountType: coupon.discountType,
			discountValue: coupon.discountValue,
			minimumPurchaseAmount: coupon.minimumPurchaseAmount,
			maximumDiscount: coupon.maximumDiscount,
			usageLimit: coupon.usageLimit,
			usedCount: coupon.usedCount,
			startDate: new Date(coupon.startDate).toISOString().slice(0, 10),
			expiryDate: new Date(coupon.expiryDate).toISOString().slice(0, 10),
			isActive: coupon.isActive,
		} : blankValues);
	}, [coupon, form]);

	const error = (name: keyof CouponFormInput) => form.formState.errors[name]?.message as string | undefined;

	const submit = form.handleSubmit(async (values) => {
		await onSubmit({
			...values,
			code: values.code.trim().toUpperCase(),
			maximumDiscount: moneyOrNull(values.maximumDiscount),
		});
	});

	return (
		<form onSubmit={submit} className="space-y-4 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[.03]">
			<div>
				<p className="eyebrow">Coupon editor</p>
				<h2 className="mt-2 font-serif text-3xl text-ink dark:text-white">{coupon ? 'Edit coupon' : 'Create coupon'}</h2>
				<p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">Define the offer mechanics and the date window for the campaign.</p>
			</div>

			<Field label="Coupon code">
				<input {...form.register('code')} className={inputClass} placeholder="GOLD20" />
				{error('code') && <p className="mt-1 text-xs text-red-600">{error('code')}</p>}
			</Field>

			<Field label="Description">
				<textarea {...form.register('description')} className={inputClass} rows={3} placeholder="20% off on festive fragrance orders" />
				{error('description') && <p className="mt-1 text-xs text-red-600">{error('description')}</p>}
			</Field>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Discount type">
					<select {...form.register('discountType')} className={inputClass}>
						<option value="percentage">Percentage</option>
						<option value="fixed">Fixed amount</option>
					</select>
				</Field>
				<Field label="Discount value">
					<input {...form.register('discountValue')} type="number" min="0" step="0.01" className={inputClass} />
					{error('discountValue') && <p className="mt-1 text-xs text-red-600">{error('discountValue')}</p>}
				</Field>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Minimum purchase amount">
					<input {...form.register('minimumPurchaseAmount')} type="number" min="0" step="0.01" className={inputClass} />
				</Field>
				<Field label="Maximum discount">
					<input {...form.register('maximumDiscount')} type="number" min="0" step="0.01" className={inputClass} placeholder="Optional cap" />
				</Field>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Usage limit">
					<input {...form.register('usageLimit')} type="number" min="1" step="1" className={inputClass} />
				</Field>
				<Field label="Used count">
					<input {...form.register('usedCount')} type="number" min="0" step="1" className={inputClass} readOnly />
				</Field>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Start date">
					<input {...form.register('startDate')} type="date" className={inputClass} />
					{error('startDate') && <p className="mt-1 text-xs text-red-600">{error('startDate')}</p>}
				</Field>
				<Field label="Expiry date">
					<input {...form.register('expiryDate')} type="date" className={inputClass} />
					{error('expiryDate') && <p className="mt-1 text-xs text-red-600">{error('expiryDate')}</p>}
				</Field>
			</div>

			<label className="flex items-center justify-between rounded-2xl border border-ink/10 bg-stone-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
				<div>
					<p className="font-semibold text-ink dark:text-white">Active coupon</p>
					<p className="text-xs text-ink/50 dark:text-white/50">Toggle availability for checkout and admin listings.</p>
				</div>
				<input {...form.register('isActive')} type="checkbox" className="h-5 w-5 accent-amber-600" />
			</label>

			<button type="submit" disabled={submitting} className="button-gold w-full disabled:cursor-not-allowed disabled:opacity-60">
				{submitting ? 'Saving…' : coupon ? 'Update coupon' : 'Create coupon'}
			</button>
		</form>
	);
}