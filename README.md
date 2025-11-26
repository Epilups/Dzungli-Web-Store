
## requirements

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)

##  Local Development Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/Epilups/Dzungli-Web-Store.git>
cd Dzungli-Web-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL Database

1. **Create a PostgreSQL database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dzungli_store;

# Exit psql
\q
```

2. **Set up environment variables:**

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your local database credentials:

```env
DATABASE_USER=postgres
DATABASE_PASSWORD=your_local_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dzungli_store

JWT_SECRET=its a secret

NODE_ENV=development
```

3. **Run database migrations:**

```bash
npm run db:migrate
```

This will create all necessary tables and insert sample products.

#### Option B: Connect to DigitalOcean Database (Development)

If you want to use the production database for local development:

1. Get your DigitalOcean database credentials from the DigitalOcean dashboard
2. Update your `.env` file with the production credentials:

```env
DATABASE_USER=doadmin
DATABASE_PASSWORD=<your-do-password>
DATABASE_HOST=<your-do-host>
DATABASE_PORT=25060
DATABASE_NAME=defaultdb

JWT_SECRET=its a secret

NODE_ENV=development
```

### 4. Start the Development Server

```bash
npm run dev
```

it will be available at `http://localhost:5173`

##  Admin Access

### Default Admin Credentials

The database migration creates a default admin user:

- **Email**: `admin@storehub.com`
- **Password**: `admin123`

### Accessing the Admin Panel

1. Navigate to `http://localhost:5173`
2. Click on "Account" in the navigation
3. Log in with the admin credentials above
4. Once logged in, visit `http://localhost:5173/admin` to access the admin panel

## Deployment

### DigitalOcean App Platform

This project is configured for automatic deployment on DigitalOcean:

1. **GitHub Integration**: The app auto-deploys from the GitHub repository
2. **Database**: Uses DigitalOcean Managed PostgreSQL
3. **Environment Variables**: Set in DigitalOcean App Platform dashboard

#### Deployment Environment Variables

Ensure these are set in your DigitalOcean App Platform:

```
DATABASE_USER=doadmin
DATABASE_PASSWORD=<your-do-password>
DATABASE_HOST=<your-do-host>
DATABASE_PORT=25060
DATABASE_NAME=defaultdb
JWT_SECRET=<your-production-secret>
NODE_ENV=production
```


