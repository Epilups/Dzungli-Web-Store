import { json } from '@sveltejs/kit';
import { query, transaction } from '$lib/server/db/connection';
import { requireAuth } from '$lib/server/auth';
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

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  product_name?: string;
  product_image?: string;
}

// GET user's orders
export const GET: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const orders = await query<Order>(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query<OrderItem>(
          `SELECT 
            oi.*,
            p.name as product_name,
            p.image_url as product_image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    return json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
};

// POST create new order (checkout)
export const POST: RequestHandler = async (event) => {
  const user = await requireAuth(event);
  if (user instanceof Response) return user;

  try {
    const { shipping_address, payment_method } = await event.request.json();

    if (!shipping_address || !payment_method) {
      return json({ error: 'Shipping address and payment method required' }, { status: 400 });
    }

    const result = await transaction(async (client) => {
      // Get cart items
      const cartItems = await client.query(
        `SELECT 
          ci.product_id,
          ci.quantity,
          p.price,
          p.stock_quantity,
          p.name
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1 AND p.is_active = true`,
        [user.id]
      );

      if (cartItems.rows.length === 0) {
        throw new Error('Cart is empty');
      }

      // Check stock availability
      for (const item of cartItems.rows) {
        if (item.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
      }

      // Calculate total
      const totalAmount = cartItems.rows.reduce(
        (sum: number, item: any) => sum + (item.price * item.quantity),
        0
      );

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, status, total_amount, shipping_address, payment_method)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user.id, 'pending', totalAmount, shipping_address, payment_method]
      );

      const order = orderResult.rows[0];

      // Create order items and update stock
      for (const item of cartItems.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.price]
        );

        await client.query(
          `UPDATE products 
           SET stock_quantity = stock_quantity - $1 
           WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [user.id]);

      return order;
    });

    return json(
      {
        message: 'Order created successfully',
        order: result
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
};