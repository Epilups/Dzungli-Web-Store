import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/connection';
import { getUserFromRequest } from '$lib/server/auth';
import type { RequestHandler } from './$types';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number;
  rating: number;
  comment: string;
}

// POST - Create or update a review
export const POST: RequestHandler = async (event) => {
  try {
    const user = await getUserFromRequest(event);
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, orderId, rating, comment } = await event.request.json();

    // Validate input
    if (!productId || !orderId || !rating) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify the order belongs to the user and is delivered
    const orderCheck = await query(
      `SELECT o.id, o.status, oi.id as order_item_id
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND o.user_id = $2 AND oi.product_id = $3 AND o.status = 'delivered'`,
      [orderId, user.id, productId]
    );

    if (orderCheck.length === 0) {
      return json({ error: 'Invalid order or order not delivered yet' }, { status: 400 });
    }

    // Check if review already exists
    const existingReview = await query<Review>(
      'SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2 AND order_id = $3',
      [user.id, productId, orderId]
    );

    let review;
    if (existingReview.length > 0) {
      // Update existing review
      review = await query<Review>(
        `UPDATE reviews 
         SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3 AND product_id = $4 AND order_id = $5
         RETURNING *`,
        [rating, comment || '', user.id, productId, orderId]
      );
    } else {
      // Create new review
      review = await query<Review>(
        `INSERT INTO reviews (product_id, user_id, order_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [productId, user.id, orderId, rating, comment || '']
      );
    }

    // Update product rating and review count
    const reviewStats = await query<{ avg_rating: number; review_count: number }>(
      `SELECT 
        ROUND(AVG(rating)::numeric, 1) as avg_rating,
        COUNT(*) as review_count
       FROM reviews
       WHERE product_id = $1`,
      [productId]
    );

    if (reviewStats.length > 0) {
      await query(
        `UPDATE products 
         SET rating = $1, review_count = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [reviewStats[0].avg_rating, reviewStats[0].review_count, productId]
      );
    }

    return json({
      success: true,
      review: review[0]
    });

  } catch (error) {
    console.error('Error creating/updating review:', error);
    return json({ error: 'Failed to submit review' }, { status: 500 });
  }
};