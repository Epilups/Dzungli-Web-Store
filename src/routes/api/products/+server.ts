import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/connection';
import { requireAdmin } from '$lib/server/auth';
import type { RequestHandler } from './$types';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_active: boolean;
}

// GET all products
export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const sort = url.searchParams.get('sort') || 'featured';
    
    let queryText = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];
    let paramCount = 0;

    if (category && category !== 'all') {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    // Add sorting
    switch (sort) {
      case 'price-low':
        queryText += ' ORDER BY price ASC';
        break;
      case 'price-high':
        queryText += ' ORDER BY price DESC';
        break;
      case 'rating':
        queryText += ' ORDER BY rating DESC';
        break;
      case 'newest':
        queryText += ' ORDER BY created_at DESC';
        break;
      default:
        queryText += ' ORDER BY id ASC';
    }

    const products = await query<Product>(queryText, params);
    return json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return json({ error: 'Failed to fetch products' }, { status: 500 });
  }
};

// POST create new product (admin only)
export const POST: RequestHandler = async (event) => {
  const user = await requireAdmin(event);
  if (user instanceof Response) return user;

  try {
    const { name, description, price, image_url, category, stock_quantity } = await event.request.json();

    if (!name || !price || !category) {
      return json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const products = await query<Product>(
      `INSERT INTO products (name, description, price, image_url, category, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description || '', price, image_url || '', category, stock_quantity || 0]
    );

    return json({ product: products[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return json({ error: 'Failed to create product' }, { status: 500 });
  }
};