import { query } from '$lib/server/db/connection';
import type { PageServerLoad } from './$types';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  review_count: number;
}

export const load: PageServerLoad = async () => {
  try {
    // Get featured products (first 6 active products)
    const products = await query<Product>(
      `SELECT id, name, price, image_url, rating, review_count 
       FROM products 
       WHERE is_active = true 
       ORDER BY rating DESC, review_count DESC 
       LIMIT 6`
    );
    
    return {
      featuredProducts: products.map(p => ({
        id: String(p.id),
        name: p.name,
        price: Number(p.price),
        image: p.image_url,
        rating: Number(p.rating),
        reviews: p.review_count
      }))
    };
  } catch (error) {
    console.error('Error loading featured products:', error);
    return { featuredProducts: [] };
  }
};