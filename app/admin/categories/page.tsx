'use client';

import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';
import { DataTable, type Column } from '../_components/data-table';
import { DrawerForm, Field, inputClass } from '../_components/forms';
import { PageHeading } from '../_components/page-heading';

type Category = { _id: string; name: string; slug: string; imageUrl?: string };
type Product = { _id: string; category: { _id?: string; slug?: string } };
type CategoryRow = { id: string; _id: string; name: string; slug: string; imageUrl?: string; products: number };

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		const load = async () => {
			try {
				const [categoriesResponse, productsResponse] = await Promise.all([
					api.get('/categories'),
					api.get('/products', { params: { limit: 100, page: 1 } }),
				]);

				if (!active) return;
				setCategories(categoriesResponse.data || []);
				setProducts(productsResponse.data?.items || productsResponse.data?.products || []);
			} catch {
				if (!active) return;
				setCategories([]);
				setProducts([]);
			} finally {
				if (active) setLoading(false);
			}
		};

		void load();
		return () => {
			active = false;
		};
	}, []);

	const rows = useMemo<CategoryRow[]>(() => {
		return categories.map((category) => ({
			id: category._id,
			...category,
			products: products.filter((product) => product.category?._id === category._id || product.category?.slug === category.slug).length,
		}));
	}, [categories, products]);

	const columns: Column<CategoryRow>[] = [
		{ label: 'Category', render: (row) => <p className="font-semibold text-ink dark:text-white">{row.name}</p> },
		{ label: 'Slug', render: (row) => <code className="text-xs text-gold">/{row.slug}</code> },
		{ label: 'Products', render: (row) => `${row.products} fragrances` },
	];

	return (
		<div>
			<PageHeading
				title="Categories"
				description="Organize the fragrance catalogue into elegant, discoverable collections."
				action={
					<DrawerForm
						title="Add category"
						trigger={<button className="button-gold"><Plus className="mr-2" size={16} />New category</button>}
					>
						<form className="space-y-4">
							<Field label="Category name"><input className={inputClass} placeholder="Unisex" /></Field>
							<Field label="Collection image URL"><input className={inputClass} placeholder="https://…" /></Field>
							<button className="button-gold w-full">Save category</button>
						</form>
					</DrawerForm>
				}
			/>

			<div className="mt-8 grid gap-4 sm:grid-cols-3">
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">Seeded categories</p><p className="mt-2 font-serif text-3xl">{loading ? '—' : rows.length}</p></section>
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">Seeded products</p><p className="mt-2 font-serif text-3xl">{loading ? '—' : products.length}</p></section>
				<section className="border border-ink/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[.03]"><p className="text-xs uppercase tracking-widest text-ink/50 dark:text-white/50">Live status</p><p className="mt-2 font-serif text-3xl">{loading ? 'Loading…' : 'Connected'}</p></section>
			</div>

			<div className="mt-8">
				<DataTable columns={columns} rows={rows} pageSize={4} />
			</div>
		</div>
	);
}