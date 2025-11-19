# Backend Implementation - StoreHub E-commerce

## Overview

Complete full-stack e-commerce application with PostgreSQL database, RESTful API, authentication, and admin dashboard.

## Database Setup

### Connection Details
- **Provider**: DigitalOcean PostgreSQL
- **Host**: webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com
- **Port**: 25060
- **Database**: defaultdb
- **User**: doadmin

### Database Schema

The application uses the following tables:

1. **users** - User accounts with authentication
2. **products** - Product catalog with inventory
3. **orders** - Customer orders with status tracking
4. **order_items** - Individual items in each order
5. **cart_items** - Shopping cart functionality
6. **sessions** - User session management

### Initial Setup

Run the database migration:
```bash
node scripts/migrate.js
```

This creates all tables, indexes, and inserts sample data including:
- 12 sample products across 4 categories
- Default admin account (email: admin@storehub.com, password: admin123)

## Architecture

### Backend Structure

```
src/lib/server/
├── db/
│   ├── schema.sql          # Database schema
│   ├── migrate.ts          # Migration script
│   └── connection.ts       # Database connection pool
└── auth.ts                 # Authentication utilities

src/routes/api/
├── auth/
│   ├── register/+server.ts # User registration
│   ├── login/+server.ts    # User login
│   ├── logout/+server.ts   # User logout
│   └── me/+server.ts       # Get current user
├── products/
│   ├── +server.ts          # List/Create products
│   └── [id]/+server.ts     # Get/Update/Delete product
├── cart/
│   ├── +server.ts          # Get cart, Add to cart
│   └── [id]/+server.ts     # Update/Remove cart item
└── orders/
    ├── +server.ts          # List/Create orders
    └── [id]/+server.ts     # Get/Update order
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  },
  "message": "Registration successful"
}
```

#### POST `/api/auth/login`
Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "message": "Login successful"
}
```

Sets HttpOnly cookie: `auth_token` (JWT, 7 days expiry)

#### POST `/api/auth/logout`
Logout and clear session.

#### GET `/api/auth/me`
Get current authenticated user.

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  }
}
```

### Products

#### GET `/api/products`
Get all active products with filtering and sorting.

**Query Parameters:**
- `category` - Filter by category (electronics, fashion, home, sports)
- `search` - Search by product name
- `sort` - Sort order (featured, price-low, price-high, rating, newest)

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Premium Wireless Headphones",
      "description": "High-quality wireless headphones...",
      "price": 149.99,
      "image_url": "https://...",
      "category": "electronics",
      "stock_quantity": 50,
      "rating": 4.8,
      "review_count": 256,
      "is_active": true
    }
  ]
}
```

#### POST `/api/products` (Admin Only)
Create a new product.

**Request:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "image_url": "https://...",
  "category": "electronics",
  "stock_quantity": 100
}
```

#### GET `/api/products/[id]`
Get single product by ID.

#### PUT `/api/products/[id]` (Admin Only)
Update product details.

#### DELETE `/api/products/[id]` (Admin Only)
Delete a product.

### Shopping Cart

#### GET `/api/cart` (Authenticated)
Get current user's cart.

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "product_id": 5,
      "quantity": 2,
      "product_name": "Mechanical Keyboard",
      "product_price": 129.99,
      "product_image": "https://...",
      "stock_quantity": 75
    }
  ],
  "total": 259.98,
  "itemCount": 2
}
```

#### POST `/api/cart` (Authenticated)
Add item to cart.

**Request:**
```json
{
  "product_id": 5,
  "quantity": 1
}
```

#### PUT `/api/cart/[id]` (Authenticated)
Update cart item quantity.

**Request:**
```json
{
  "quantity": 3
}
```

#### DELETE `/api/cart/[id]` (Authenticated)
Remove item from cart.

#### DELETE `/api/cart` (Authenticated)
Clear entire cart.

### Orders

#### GET `/api/orders` (Authenticated)
Get user's order history.

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "status": "delivered",
      "total_amount": 299.98,
      "shipping_address": "123 Main St...",
      "payment_method": "credit_card",
      "created_at": "2024-01-01T12:00:00Z",
      "items": [
        {
          "product_id": 5,
          "product_name": "Mechanical Keyboard",
          "quantity": 2,
          "price_at_time": 129.99
        }
      ]
    }
  ]
}
```

#### POST `/api/orders` (Authenticated)
Create new order (checkout).

**Request:**
```json
{
  "shipping_address": "123 Main St, City, State 12345",
  "payment_method": "credit_card"
}
```

**Process:**
1. Validates cart is not empty
2. Checks stock availability
3. Creates order record
4. Creates order items
5. Decrements product stock
6. Clears user's cart

#### GET `/api/orders/[id]` (Authenticated)
Get specific order details.

#### PUT `/api/orders/[id]` (Admin Only)
Update order status.

**Request:**
```json
{
  "status": "delivered"
}
```

**Valid Statuses:**
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by admin
- `payment_pending` - Awaiting payment
- `payment_received` - Payment confirmed
- `delivered` - Order delivered
- `canceled` - Order canceled

## Frontend Pages

### Customer Pages

1. **Home (`/`)** - Featured products and categories
2. **Products (`/products`)** - Product catalog with filters
3. **Cart (`/cart`)** - Shopping cart management
4. **Account (`/account`)** - Login/Register and order history
5. **Orders (`/orders`)** - Detailed order tracking

### Admin Pages

1. **Admin Dashboard (`/admin`)** - Product and order management
   - Create/Edit/Delete products
   - Update order statuses
   - View all orders

## Authentication & Security

### Session Management
- JWT tokens stored in HttpOnly cookies
- 7-day token expiration
- Automatic session validation on protected routes

### Password Security
- bcrypt hashing (10 rounds)
- Passwords never stored in plain text

### Authorization
- `requireAuth()` - Ensures user is logged in
- `requireAdmin()` - Ensures user is admin

### Protected Routes
- Cart operations require authentication
- Order creation/viewing requires authentication
- Product management requires admin access
- Order status updates require admin access

## Features Implemented

### Customer Features
✅ Browse product catalog
✅ Search and filter products
✅ Add items to shopping cart
✅ Register and log in
✅ Track and review orders
✅ Responsive UI design

### Admin Features
✅ Create product listings
✅ Review customer orders
✅ Manage order statuses
✅ Update/Delete products
✅ View all orders with customer info

### Technical Features
✅ RESTful API design
✅ PostgreSQL database
✅ Server-side rendering (SSR)
✅ JWT authentication
✅ Transaction-safe ordering
✅ Stock management
✅ Order status tracking (6 statuses)

## Order Statuses

1. **pending** - Initial state when order is placed
2. **confirmed** - Admin has reviewed and confirmed order
3. **payment_pending** - Awaiting payment confirmation
4. **payment_received** - Payment has been received
5. **delivered** - Order has been delivered to customer
6. **canceled** - Order has been canceled

## Technologies Used

- **Frontend**: SvelteKit 2 + Svelte 5 + TypeScript
- **Styling**: TailwindCSS 3.4.11
- **Backend**: SvelteKit API Routes
- **Database**: PostgreSQL (DigitalOcean)
- **Authentication**: JWT + bcryptjs
- **HTTP Client**: Native fetch API

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migration:**
   ```bash
   node scripts/migrate.js
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Customer site: http://localhost:5173
   - Admin login: admin@storehub.com / admin123

## Default Test Accounts

### Admin Account
- Email: admin@storehub.com
- Password: admin123

### Sample Products
12 products across 4 categories (electronics, fashion, home, sports) are automatically created during migration.

## API Response Status Codes

- **200 OK** - Successful GET/PUT/DELETE request
- **201 Created** - Successful POST request
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Database Indexes

Optimized queries with indexes on:
- products: category, is_active
- orders: user_id, status
- order_items: order_id
- cart_items: user_id
- sessions: session_token, user_id

## Error Handling

All API endpoints include comprehensive error handling:
- Input validation
- Database error catching
- Transaction rollback on failures
- User-friendly error messages

## Next Steps / Future Enhancements

- Add product reviews and ratings
- Implement email notifications
- Add payment gateway integration
- Implement product images upload
- Add inventory alerts for low stock
- Enhanced search with full-text search
- Product categories management
- Customer address book
- Order refund functionality
- Analytics and reporting dashboard