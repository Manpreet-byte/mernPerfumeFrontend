import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { Product } from '../types';

export type ProductQuery = {
  search?: string;
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  fragranceNotes?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating_desc' | 'best_sellers';
  page?: number;
  limit?: number;
};

type ProductListResponse = {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ProductState = {
  products: Product[];
  product: Product | null;
  search: string;
  filters: ProductQuery;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  suggestions: string[];
  loading: boolean;
  productLoading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  product: null,
  search: '',
  filters: {},
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  suggestions: [],
  loading: false,
  productLoading: false,
  error: null,
};

const toQueryString = (params?: ProductQuery) => {
  const query = new URLSearchParams();
  if (!params) return '';
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    if (key === 'fragranceNotes' && Array.isArray(value)) {
      if (value.length) query.set('fragranceNotes', value.join(','));
      return;
    }
    query.set(key, String(value));
  });
  return query.toString();
};

export const fetchProducts = createAsyncThunk<ProductListResponse, ProductQuery | undefined>('products/fetchProducts', async (params) => {
  const query = toQueryString(params);
  const { data } = await api.get(`/products${query ? `?${query}` : ''}`);
  return data;
});

export const fetchProduct = createAsyncThunk<Product, string>('products/fetchProduct', async (id) => (await api.get(`/products/${id}`)).data);

export const fetchSearchSuggestions = createAsyncThunk<string[], string>('products/fetchSearchSuggestions', async (searchTerm) => {
  const query = toQueryString({ search: searchTerm, page: 1, limit: 6, sort: 'newest' });
  const { data } = await api.get(`/products?${query}`);
  const names: string[] = (data.products ?? []).map((product: Product) => product.name);
  return Array.from(new Set(names));
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setFilters(state, action: PayloadAction<ProductQuery>) {
      state.filters = action.payload;
    },
    clearProduct(state) {
      state.product = null;
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Unable to load products.';
      })
      .addCase(fetchProduct.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.productLoading = false;
        state.error = 'Unable to load product.';
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state) => {
        state.suggestions = [];
      });
  },
});

export const { setSearch, setFilters, clearProduct, clearSuggestions } = productSlice.actions;
export default productSlice.reducer;
