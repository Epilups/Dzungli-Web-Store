# StoreHub - E-commerce SvelteKit Application

A modern, full-stack e-commerce application built with SvelteKit, TypeScript, and PostgreSQL. Features user authentication, shopping cart, order management, and admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd StoreHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize database**
   ```bash
   node scripts/migrate.js
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📋 Features

- **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- **Product Catalog** - Browse and search products with categories
- **Shopping Cart** - Add/remove items and manage cart
- **Order Management** - Place orders and track status
- **Admin Dashboard** - Manage products, orders, and users
- **Responsive Design** - Mobile-first TailwindCSS styling
- **Database Migrations** - Automated schema setup and updates

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 + TypeScript
- **Styling**: TailwindCSS 3.4.11
- **Database**: PostgreSQL
- **Authentication**: JWT + bcryptjs
- **Backend**: SvelteKit server endpoints

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   ├── server/
│   │   ├── auth.ts     # Authentication utilities
│   │   └── db/         # Database connection & schema
│   └── index.ts        # Shared utilities
├── routes/
│   ├── api/            # REST API endpoints
│   ├── admin/          # Admin dashboard
│   ├── account/        # User account pages
│   └── +page.svelte    # Main pages
└── app.html            # App template
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type checking
npm run lint         # Lint code
npm run test         # Run tests
```

### Database Management

```bash
node scripts/migrate.js      # Run database migrations
node scripts/create-admin.js # Create admin user
node scripts/reset-reviews.js # Reset review data
```

## 🚀 Deployment

### DigitalOcean App Platform

**Build Command:** `npm run build`
**Run Command:** `npm run preview`
**Public Port:** `5173`

#### Environment Variables Required:

```bash
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host
DATABASE_PORT=25060
DATABASE_NAME=your_db_name
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Other Platforms

The application uses standard Node.js deployment practices and can be deployed on:
- Vercel
- Netlify
- Railway
- Heroku
- AWS

## 👥 Default Accounts

- **Admin**: admin@storehub.com / admin123
- **Customer**: Create account through registration

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using SvelteKit**
