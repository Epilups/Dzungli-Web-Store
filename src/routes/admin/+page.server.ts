import { query } from '$lib/server/db/connection';
import { getUserFromRequest } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

interface Order {
  id: number;
  user_id: number;
  user_email: string;
  status: string;
  total_amount: number;
  created_at: Date;
}

export const load: PageServerLoad = async (event) => {
  const user = await getUserFromRequest(event);
  
  if (!user || !user.is_admin) {
    throw redirect(302, '/account');
  }

  try {
    // Get all products
    const products = await query<Product>(
      'SELECT * FROM products ORDER BY id DESC'
    );

    // Get all orders with user info
    const orders = await query<Order>(
      `SELECT o.*, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 50`
    );

    return {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        imageUrl: p.image_url,
        category: p.category,
        stockQuantity: p.stock_quantity,
        rating: Number(p.rating),
        reviewCount: p.review_count,
        isActive: p.is_active
      })),
      orders: orders.map(o => ({
        id: o.id,
        userId: o.user_id,
        userEmail: o.user_email,
        status: o.status,
        totalAmount: Number(o.total_amount),
        createdAt: o.created_at
      }))
    };
  } catch (error) {
    console.error('Error loading admin data:', error);
    return { products: [], orders: [] };
  }
};