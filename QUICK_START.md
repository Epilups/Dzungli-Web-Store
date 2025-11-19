# Quick Start Guide - StoreHub E-commerce

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
node scripts/migrate.js
```

This will:
- ✅ Create all database tables
- ✅ Set up indexes for performance
- ✅ Insert 12 sample products
- ✅ Create admin account

### 3. Start Development Server
```bash
npm run dev
```

Access at: **http://localhost:5173**

## Test Accounts

### Admin Account
- **Email**: admin@storehub.com
- **Password**: admin123
- **Access**: Full admin dashboard at `/admin`

### Create Customer Account
- Register at `/account`
- Test the full shopping experience

## Quick Feature Tour

### Customer Flow
1. **Browse Products** - Visit home page or `/products`
2. **Add to Cart** - Click cart icon on any product
3. **Login/Register** - Go to `/account`
4. **View Cart** - Navigate to `/cart`
5. **Checkout** - Fill shipping & payment info
6. **Track Orders** - View at `/orders` or `/account`

### Admin Flow
1. **Login** - Use admin credentials at `/account`
2. **Access Dashboard** - Click "Go to Admin Dashboard" or visit `/admin`
3. **Manage Products** - Create, edit, or delete products
4. **Manage Orders** - Update order statuses

## API Endpoints

All API endpoints are available at: `http://localhost:5173/api/`

### Key Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/products` - Get products
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Place order

See [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) for complete API documentation.

## Database Connection

The application is already configured to connect to your DigitalOcean PostgreSQL database:
- Host: webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com
- Port: 25060
- Database: defaultdb

Connection details are in [`src/lib/server/db/connection.ts`](./src/lib/server/db/connection.ts)

## Project Structure

```
src/
├── lib/server/          # Backend code
│   ├── db/             # Database connection & schema
│   └── auth.ts         # Authentication utilities
├── routes/             # Pages & API endpoints
│   ├── +page.svelte    # Home page
│   ├── products/       # Product catalog
│   ├── cart/           # Shopping cart
│   ├── account/        # User account & login
│   ├── orders/         # Order history
│   ├── admin/          # Admin dashboard
│   └── api/            # REST API endpoints
```

## Troubleshooting

### Database Connection Issues
If you get SSL certificate errors, the migration script is already configured to handle them.

### Port Already in Use
Change the port in `vite.config.ts` or kill the process using port 5173.

### TypeScript Errors
The project uses SvelteKit's automatic type generation. Run:
```bash
npm run dev
```
This will generate the `./$types` files automatically.

## Next Steps

1. ✅ Explore the admin dashboard
2. ✅ Test the shopping flow
3. ✅ Review API endpoints with tools like Postman
4. ✅ Customize the design and branding
5. ✅ Add more products through admin panel

## Support

For detailed information, see:
- [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) - Complete technical documentation
- [AGENTS.md](./AGENTS.md) - Original project specifications

## Technologies

- **Frontend**: SvelteKit 2 + Svelte 5 + TypeScript
- **Styling**: TailwindCSS 3.4.11
- **Database**: PostgreSQL (DigitalOcean)
- **Auth**: JWT + bcryptjs
- **API**: RESTful design

---

**Ready to start building! 🚀**