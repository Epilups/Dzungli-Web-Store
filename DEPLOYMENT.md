# Deployment Guide - StoreHub E-commerce

This guide will help you deploy the StoreHub e-commerce application to DigitalOcean App Platform.

## Environment Variables Required

Add these environment variables to your DigitalOcean App Platform configuration:

```
# Database Configuration
DATABASE_USER=doadmin
DATABASE_PASSWORD=your_database_password_here
DATABASE_HOST=your_database_host_here
DATABASE_PORT=25060
DATABASE_NAME=defaultdb

# JWT Secret (Generate a new secure one for production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-dzungli-2024

# Node Environment
NODE_ENV=production
```

## Build Configuration

**Build Command:** `npm run build`

**Run Command:** `npm run preview`

**Public Port:** `5173`

## Database Migration

The application includes an automatic database migration script. You can run it manually using:

```bash
node scripts/migrate.js
```

Or set it up as a one-time job in DigitalOcean App Platform.

## DigitalOcean App Platform Setup

1. **Connect your GitHub repository**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub account
   - Select this repository

2. **Configure your app**
   - **Source Directory:** `/` (root)
   - **Build Command:** `npm run build`
   - **Run Command:** `npm run preview`
   - **HTTP Port:** `5173`

3. **Add Environment Variables**
   - Add all the environment variables listed above
   - Make sure to use your actual database credentials

4. **Add Database**
   - Connect your existing PostgreSQL database
   - Or create a new one through DigitalOcean

5. **Deploy**
   - Click "Create and Deploy App"
   - Wait for the deployment to complete

## Post-Deployment Steps

1. **Run Database Migration**
   - Access your app's console
   - Run: `node scripts/migrate.js`

2. **Create Admin User**
   - Access your app's console
   - Run: `node scripts/create-admin.js`
   - Or register a new user and update their `is_admin` field to `true` in the database

3. **Test the Application**
   - Visit your app's URL
   - Test user registration and login
   - Test the admin dashboard at `/admin`

## Health Checks

The application is configured with automatic health checks. Ensure your DigitalOcean App Platform has health checks enabled.

## SSL/HTTPS

DigitalOcean App Platform automatically provides SSL certificates for custom domains and the provided `*.ondigitalocean.app` domain.

## Monitoring

Consider setting up monitoring for:
- Database connection health
- Application response times
- Error rates

## Troubleshooting

### Database Connection Issues
- Verify your database credentials in environment variables
- Check if your database allows connections from DigitalOcean App Platform
- Ensure SSL is properly configured

### Build Failures
- Check the build logs in DigitalOcean App Platform
- Verify all dependencies are properly listed in `package.json`
- Ensure Node.js version compatibility

### Runtime Issues
- Check application logs in DigitalOcean App Platform
- Verify environment variables are correctly set
- Test database connectivity

## Scaling

As your application grows, consider:
- Scaling your database
- Adding a CDN for static assets
- Implementing caching strategies
- Using a load balancer for multiple app instances

## Security Notes

- Always use strong, unique passwords for production
- Regularly rotate your JWT secret
- Keep dependencies up to date
- Consider implementing rate limiting for API endpoints
- Use a firewall to restrict database access

---

**Ready for production! 🚀**