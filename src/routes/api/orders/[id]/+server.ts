import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/connection';
import { requireAuth, requireAdmin } from '$lib/server/auth';
import type { RequestHandler } from './$types';

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  created_at: Date;
}

// GET single order
export const GET: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const orders = await query<Order>(
      'SELECT * FROM orders WHERE id = $1',
      [event.params.id]
    );

    if (orders.length === 0) {
      return json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];

    // Check if user owns this order or is admin
    if (order.user_id !== user.id && !user.is_admin) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get order items
    const items = await query(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    return json({ order: { ...order, items } });
  } catch (error) {
    console.error('Error fetching order:', error);
    return json({ error: 'Failed to fetch order' }, { status: 500 });
  }
};

// PUT update order status (admin only)
export const PUT: RequestHandler = async (event) => {
  const user = await requireAdmin(event);
  if (user instanceof Response) return user;

  try {
    const { status } = await event.request.json();

    const validStatuses = ['pending', 'confirmed', 'payment_pending', 'payment_received', 'delivered', 'canceled'];
    if (!validStatuses.includes(status)) {
      return json({ error: 'Invalid status' }, { status: 400 });
    }

    const orders = await query<Order>(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, event.params.id]
    );

    if (orders.length === 0) {
      return json({ error: 'Order not found' }, { status: 404 });
    }

    return json({ message: 'Order status updated', order: orders[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    return json({ error: 'Failed to update order' }, { status: 500 });
  }
};