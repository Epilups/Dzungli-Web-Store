import { query } from '$lib/server/db/connection';
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

export const load: PageServerLoad = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const sort = url.searchParams.get('sort') || 'featured';
    
    let queryText = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];
    let paramCount = 0;

    if (category && category !== 'all') {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    // Add sorting
    switch (sort) {
      case 'price-low':
        queryText += ' ORDER BY price ASC';
        break;
      case 'price-high':
        queryText += ' ORDER BY price DESC';
        break;
      case 'rating':
        queryText += ' ORDER BY rating DESC';
        break;
      case 'newest':
        queryText += ' ORDER BY created_at DESC';
        break;
      default:
        queryText += ' ORDER BY id ASC';
    }

    const products = await query<Product>(queryText, params);
    
    return {
      products: products.map(p => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        price: Number(p.price),
        image: p.image_url,
        rating: Number(p.rating),
        reviews: p.review_count,
        category: p.category,
        inStock: p.stock_quantity > 0
      }))
    };
  } catch (error) {
    console.error('Error loading products:', error);
    return { products: [] };
  }
};