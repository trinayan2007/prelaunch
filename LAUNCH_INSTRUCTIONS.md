# Secure Launch Instructions for Prelaunch Website

This document provides a comprehensive guide to securely launch your prelaunch website and access it just before the official launch.

## Security Measures Implemented

Your website has been secured with the following measures:

- **Content Security Policy (CSP)**: Strict rules to prevent cross-site scripting (XSS) attacks by limiting sources of content.
- **Secure Session Management**: HTTPS-only cookies, HTTP-only flags, and 'Strict' SameSite policy.
- **Rate Limiting**: Protection against abuse by limiting API calls (500/day, 100/hour per IP).
- **CSRF Protection**: Enabled for all forms to prevent cross-site request forgery.
- **Encrypted Data**: Sensitive user data (email, name) is encrypted in the database.
- **Security Headers**: Additional headers like X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
- **Feature Policy**: Disabled potentially dangerous browser features like camera and microphone access.

## Pre-Launch Security Checklist

Before launching, ensure the following:

1. **Environment Variables**: Verify that `.env` file contains `SECRET_KEY` and `ENCRYPTION_KEY` with strong, unique values.
2. **Database Security**: Ensure database connection string (if not SQLite) uses secure credentials and SSL if available.
3. **Redis Security**: If using Redis for rate limiting, ensure it's properly secured and not publicly accessible.
4. **SSL Certificate**: Obtain and configure a valid SSL certificate for production.
5. **Backup**: Create a backup of your database and code before deployment.
6. **Logging**: Ensure error logging is enabled but doesn't expose sensitive information.
7. **Dependencies**: Update all dependencies to their latest secure versions (`pip install --upgrade <package>`).

## How to Access the Website Before Launch

To view and test the website locally before official launch:

1. **Ensure Dependencies**: Make sure all required packages are installed:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Setup**: Ensure your `.env` file is in the root directory with necessary credentials.

3. **Database Initialization**: Create the database tables:
   ```bash
   python create_db.py
   ```

4. **Run the Application**: Start the server locally:
   ```bash
   python run_prelaunch.py
   ```

5. **Access the Website**: Open your browser and navigate to `http://127.0.0.1:5001/`.
   - If running in test mode with SSL, use `https://127.0.0.1:5001/`.

6. **Testing**: Verify all pages load correctly (landing, privacy policy, terms of service, about) and test the waiting list signup functionality.

## Production Deployment Notes

- Use a WSGI server like Gunicorn behind Nginx or Apache for production.
- Configure proper SSL termination at the reverse proxy level.
- Ensure proper file permissions (no world-writable files).
- Set up monitoring and alerting for suspicious activities.

## Troubleshooting

- **Server Doesn't Start**: Check if port 5001 is in use; change port in `run_prelaunch.py` if needed.
- **Database Errors**: Ensure database file has write permissions or connection string is correct.
- **SSL Errors**: If testing with HTTPS, ensure `cert.pem` and `key.pem` are valid and in the root directory.

If you encounter any issues, check the console output for error messages or consult the logs in production.

## Production Launch Checklist

### 1. Server Setup
```bash
# Install requirements
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export SECRET_KEY="your-secure-key"
export DATABASE_URL="sqlite:////path/to/prod.db"

# Initialize database
flask db upgrade
```

### 2. Start Production Server
```bash
waitress-serve --port=5000 --threads=8 "prelaunch:create_app()"
```

### 3. Monitoring
- [ ] Enable error tracking (Sentry/Slack)
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Install SSL certificate (Let's Encrypt) 