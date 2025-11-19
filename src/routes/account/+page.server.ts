import { query } from '$lib/server/db/connection';
import { getUserFromRequest } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

interface Order {
  id: number;
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
  product_name: string;
  product_image: string;
}

export const load: PageServerLoad = async (event) => {
  const user = await getUserFromRequest(event);
  
  if (!user) {
    return {
      user: null,
      orders: []
    };
  }

  try {
    const orders = await query<Order>(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

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
        return {
          id: order.id,
          status: order.status,
          totalAmount: Number(order.total_amount),
          shippingAddress: order.shipping_address,
          paymentMethod: order.payment_method,
          createdAt: order.created_at,
          items: items.map(item => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            quantity: item.quantity,
            priceAtTime: Number(item.price_at_time)
          }))
        };
      })
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin
      },
      orders: ordersWithItems
    };
  } catch (error) {
    console.error('Error loading account data:', error);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin
      },
      orders: []
    };
  }
};