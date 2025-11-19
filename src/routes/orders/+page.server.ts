import { query } from '$lib/server/db/connection';
import { getUserFromRequest } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
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
    throw redirect(302, '/account');
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
        
        // Check which items have been reviewed
        const itemsWithReviews = await Promise.all(
          items.map(async (item) => {
            const existingReview = await query(
              `SELECT rating, comment FROM reviews
               WHERE user_id = $1 AND product_id = $2 AND order_id = $3`,
              [user.id, item.product_id, order.id]
            );
            
            return {
              id: item.id,
              productId: item.product_id,
              productName: item.product_name,
              productImage: item.product_image,
              quantity: item.quantity,
              priceAtTime: Number(item.price_at_time),
              hasReview: existingReview.length > 0,
              existingRating: existingReview.length > 0 ? existingReview[0].rating : null,
              existingComment: existingReview.length > 0 ? existingReview[0].comment : null
            };
          })
        );
        
        return {
          id: order.id,
          status: order.status,
          totalAmount: Number(order.total_amount),
          shippingAddress: order.shipping_address,
          paymentMethod: order.payment_method,
          createdAt: order.created_at,
          items: itemsWithReviews
        };
      })
    );

    return { orders: ordersWithItems };
  } catch (error) {
    console.error('Error loading orders:', error);
    return { orders: [] };
  }
};