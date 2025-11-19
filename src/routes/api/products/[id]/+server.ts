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

// GET single product
export const GET: RequestHandler = async ({ params }) => {
  try {
    const products = await query<Product>(
      'SELECT * FROM products WHERE id = $1',
      [params.id]
    );

    if (products.length === 0) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ product: products[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    return json({ error: 'Failed to fetch product' }, { status: 500 });
  }
};

// PUT update product (admin only)
export const PUT: RequestHandler = async (event) => {
  const user = await requireAdmin(event);
  if (user instanceof Response) return user;

  try {
    const { name, description, price, image_url, category, stock_quantity, is_active } = await event.request.json();

    const products = await query<Product>(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           image_url = COALESCE($4, image_url),
           category = COALESCE($5, category),
           stock_quantity = COALESCE($6, stock_quantity),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, description, price, image_url, category, stock_quantity, is_active, event.params.id]
    );

    if (products.length === 0) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ product: products[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    return json({ error: 'Failed to update product' }, { status: 500 });
  }
};

// DELETE product (admin only)
export const DELETE: RequestHandler = async (event) => {
  const user = await requireAdmin(event);
  if (user instanceof Response) return user;

  try {
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [event.params.id]
    );

    if (result.length === 0) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return json({ error: 'Failed to delete product' }, { status: 500 });
  }
};