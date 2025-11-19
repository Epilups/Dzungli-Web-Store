import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/connection';
import { requireAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// PUT update cart item quantity
export const PUT: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const { quantity } = await event.request.json();

    if (!quantity || quantity < 1) {
      return json({ error: 'Valid quantity required' }, { status: 400 });
    }

    // Check if cart item belongs to user
    const cartItems = await query(
      'SELECT product_id FROM cart_items WHERE id = $1 AND user_id = $2',
      [event.params.id, user.id]
    );

    if (cartItems.length === 0) {
      return json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check product stock
    const products = await query(
      'SELECT stock_quantity FROM products WHERE id = $1',
      [cartItems[0].product_id]
    );

    if (products.length === 0 || products[0].stock_quantity < quantity) {
      return json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Update quantity
    const updated = await query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [quantity, event.params.id, user.id]
    );

    return json({ message: 'Cart item updated', item: updated[0] });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return json({ error: 'Failed to update cart item' }, { status: 500 });
  }
};

// DELETE remove cart item
export const DELETE: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const result = await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [event.params.id, user.id]
    );

    if (result.length === 0) {
      return json({ error: 'Cart item not found' }, { status: 404 });
    }

    return json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
};