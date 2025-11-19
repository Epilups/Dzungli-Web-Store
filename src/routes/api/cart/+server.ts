import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/connection';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image: string;
  stock_quantity: number;
}

// GET user's cart
export const GET: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const cartItems = await query<CartItem>(
      `SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        p.name as product_name,
        p.price as product_price,
        p.image_url as product_image,
        p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1 AND p.is_active = true
       ORDER BY ci.created_at DESC`,
      [user.id]
    );

    const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

    return json({
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
};

// POST add item to cart
export const POST: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const { product_id, quantity = 1 } = await event.request.json();

    if (!product_id || quantity < 1) {
      return json({ error: 'Valid product_id and quantity required' }, { status: 400 });
    }

    // Check if product exists and has stock
    const products = await query(
      'SELECT stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [product_id]
    );

    if (products.length === 0) {
      return json({ error: 'Product not found or unavailable' }, { status: 404 });
    }

    if (products[0].stock_quantity < quantity) {
      return json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Add or update cart item
    const cartItems = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [user.id, product_id, quantity]
    );

    return json({ message: 'Item added to cart', item: cartItems[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
};

// DELETE clear cart
export const DELETE: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    await query('DELETE FROM cart_items WHERE user_id = $1', [user.id]);
    return json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return json({ error: 'Failed to clear cart' }, { status: 500 });
  }
};