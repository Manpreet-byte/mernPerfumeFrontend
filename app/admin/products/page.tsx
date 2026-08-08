'use client';

import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';
import { DataTable, type Column } from '../_components/data-table';
import { DrawerForm } from '../_components/forms';
import { PageHeading } from '../_components/page-heading';
import { ProductForm, type ProductForForm, type ProductFormValues } from './product-form';

type Category = { _id: string; name: string };
type Product = ProductForForm & { _id: string; category: Category; slug: string };
type Pagination = { page: number; pages: number; total: number };

const DEFAULT_PAGINATION: Pagination = { page: 1, pages: 1, total: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadProducts = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get('/products', {
          params: {
            page,
            limit: 10,
            search: search || undefined,
            category: category || undefined,
          },
        });

        const data = response?.data ?? {};
        const nextProducts = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.products)
            ? data.products
            : [];

        setProducts(nextProducts);
        setPagination(data.pagination ?? DEFAULT_PAGINATION);
      } catch {
        setProducts([]);
        setPagination(DEFAULT_PAGINATION);
        setMessage('Unable to load products. Check your API connection.');
      }
    },
    [category, search],
  );

  useEffect(() => {
    api
      .get('/categories')
      .then((response) => {
        const data = response?.data;
        setCategories(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(1), 250);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const saveProduct = async (values: ProductFormValues) => {
    setSubmitting(true);
    setMessage('');

    const payload = {
      ...values,
      images: Array.isArray(values.images) ? values.images.map((image) => image.url).filter(Boolean) : [],
      fragranceNotes: Array.isArray(values.fragranceNotes)
        ? values.fragranceNotes.map((note) => note.value).filter(Boolean)
        : [],
      discountPrice: values.discountPrice ?? undefined,
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setEditing(null);
      setMessage(editing ? 'Product updated.' : 'Product created.');
      await loadProducts(editing ? pagination.page : 1);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Unable to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/products/${product._id}`);
      setMessage('Product deleted.');
      await loadProducts(products.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page);
    } catch {
      setMessage('Unable to delete product.');
    }
  };

  const rows = useMemo(
    () => (Array.isArray(products) ? products.map((product) => ({ ...product, id: product._id })) : []),
    [products],
  );

  const columns: Column<(typeof rows)[number]>[] = [
    {
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.images?.[0] || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=200&q=60'}
            alt={row.name}
            className="h-10 w-9 object-cover"
          />
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="mt-1 text-xs text-ink/50 dark:text-white/50">{row.brand}</p>
          </div>
        </div>
      ),
    },
    { label: 'Category', render: (row) => row.category?.name || '—' },
    { label: 'Price', render: (row) => `$${(row.discountPrice ?? row.price).toFixed(2)}` },
    {
      label: 'Stock',
      render: (row) => <span className={row.stock < 5 ? 'font-semibold text-gold' : ''}>{row.stock} units</span>,
    },
    {
      label: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            row.stock === 0
              ? 'bg-red-100 text-red-800'
              : row.stock < 5
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {row.stock === 0 ? 'Out of stock' : row.stock < 5 ? 'Low stock' : 'Active'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeading
        title="Products"
        description="Create, edit, find, and manage every fragrance in the catalogue."
        action={
          <DrawerForm
            title="Add a fragrance"
            trigger={
              <button className="button-gold">
                <Plus className="mr-2" size={16} />
                New product
              </button>
            }
          >
            <ProductForm categories={categories} onSubmit={saveProduct} submitting={submitting} />
          </DrawerForm>
        }
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 border border-ink/15 bg-white px-3 dark:border-white/15 dark:bg-white/5">
          <Search size={16} className="text-gold" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none"
            placeholder="Search name, brand, or description"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="border border-ink/15 bg-white px-3 py-3 text-sm outline-none dark:border-white/15 dark:bg-white/5"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option value={item._id} key={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {message && <p className="mt-4 text-sm text-gold">{message}</p>}

      <div className="mt-5">
        <DataTable
          columns={columns}
          rows={rows}
          pagination={pagination}
          onPageChange={loadProducts}
          renderActions={(row) => (
            <div className="flex items-center gap-2">
              <DrawerForm
                title={`Edit ${row.name}`}
                trigger={
                  <button
                    onClick={() => setEditing(row)}
                    className="text-ink/50 hover:text-gold dark:text-white/50"
                    aria-label={`Edit ${row.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                }
              >
                <ProductForm
                  product={editing?._id === row._id ? editing : row}
                  categories={categories}
                  onSubmit={saveProduct}
                  submitting={submitting}
                />
              </DrawerForm>

              <button
                onClick={() => deleteProduct(row)}
                className="text-ink/50 hover:text-red-700 dark:text-white/50"
                aria-label={`Delete ${row.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
