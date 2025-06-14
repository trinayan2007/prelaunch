# 🚀 Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account

## Step 1: Prepare Your App

Your app is already configured for Heroku with:
- ✅ `Procfile` - `web: gunicorn run_prelaunch:app`
- ✅ `requirements.txt` - All dependencies included
- ✅ Database configuration for PostgreSQL
- ✅ Environment variables setup

## Step 2: Deploy to Heroku

### Option A: Using Heroku CLI

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY="your-secret-key-here"
heroku config:set ENCRYPTION_KEY="your-encryption-key-here"
heroku config:set ADMIN_USERNAME="your-admin-username"
heroku config:set ADMIN_PASSWORD="your-secure-password"

# Deploy your code
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Run database migrations
heroku run python create_db.py

# Open your app
heroku open
```

### Option B: Using Heroku Dashboard

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click "New" → "Create new app"
3. Choose your app name and region
4. Connect your GitHub repository
5. Enable automatic deploys (optional)
6. Add PostgreSQL addon from Resources tab
7. Set environment variables in Settings tab
8. Deploy manually or enable automatic deploys

## Step 3: Environment Variables

Set these in Heroku Dashboard → Settings → Config Vars:

```
SECRET_KEY=your-very-secure-secret-key
ENCRYPTION_KEY=your-encryption-key
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

## Step 4: Database Setup

After deployment, run:
```bash
heroku run python create_db.py
```

## Step 5: Verify Deployment

1. **Test the landing page**: `https://your-app-name.herokuapp.com/`
2. **Test waiting list**: Submit the form on the landing page
3. **View admin dashboard**: `https://your-app-name.herokuapp.com/admin`
   - Username: `ADMIN_USERNAME` (from config)
   - Password: `ADMIN_PASSWORD` (from config)

## Step 6: View Waiting List Data

### Web Dashboard
- Visit: `https://your-app-name.herokuapp.com/admin`
- Login with your admin credentials
- View statistics and user data

### API Endpoint
```bash
# Get all waiting list data (requires authentication)
curl -X GET https://your-app-name.herokuapp.com/admin/api/waiting-list
```

### Database Access
```bash
# Connect to Heroku PostgreSQL
heroku pg:psql

# View waiting list table
SELECT * FROM waiting_list ORDER BY joined_at DESC;
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check `requirements.txt` and `Procfile`
2. **Database errors**: Run `heroku run python create_db.py`
3. **500 errors**: Check Heroku logs with `heroku logs --tail`
4. **Admin login fails**: Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set

### View Logs
```bash
heroku logs --tail
```

### Restart App
```bash
heroku restart
```

## Security Notes

- ✅ Change default admin credentials
- ✅ Use strong SECRET_KEY and ENCRYPTION_KEY
- ✅ Enable HTTPS (automatic on Heroku)
- ✅ Database is automatically backed up by Heroku

## Monitoring

- **App Metrics**: Heroku Dashboard → Metrics tab
- **Database Metrics**: Heroku Dashboard → Resources → PostgreSQL → Metrics
- **Error Tracking**: Consider adding Sentry or similar service

## Cost Optimization

- **Free tier**: No longer available, starts at $7/month
- **Database**: PostgreSQL Mini ($5/month) included in Basic dyno
- **Scaling**: Upgrade dyno type as needed

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificate (automatic)
3. Set up monitoring and alerts
4. Configure backup strategies
5. Set up CI/CD pipeline

---

**Your app is now live!** 🎉

Visit your Heroku URL and test the waiting list functionality. The admin dashboard will show you all the data being collected. 