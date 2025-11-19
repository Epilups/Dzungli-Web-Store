import { query } from '$lib/server/db/connection';
import { getUserFromRequest } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async (event) => {
  const user = await getUserFromRequest(event);
  
  if (!user) {
    return {
      cartItems: [],
      total: 0,
      itemCount: 0,
      needsLogin: true
    };
  }

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

    const total = cartItems.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);

    return {
      cartItems: cartItems.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product_name,
        price: Number(item.product_price),
        image: item.product_image,
        quantity: item.quantity,
        stockQuantity: item.stock_quantity
      })),
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      needsLogin: false
    };
  } catch (error) {
    console.error('Error loading cart:', error);
    return {
      cartItems: [],
      total: 0,
      itemCount: 0,
      needsLogin: false
    };
  }
};