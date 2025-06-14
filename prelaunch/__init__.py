from flask import Flask, request, redirect
from flask_sqlalchemy import SQLAlchemy
import os
from flask_talisman import Talisman
from dotenv import load_dotenv
from datetime import datetime

db = SQLAlchemy()

def create_prelaunch_app():
    # Get the base directory of the package
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    app = Flask(
        __name__,
        static_folder='static',
        template_folder='templates',
        instance_relative_config=True
    )
    
    # Enable logging
    app.logger.setLevel('INFO')
    
    # Load environment variables first
    load_dotenv(override=True)  # Force reload
    
    # Validate required environment variables
    required_env = ['SECRET_KEY']
    for var in required_env:
        if not os.getenv(var):
            raise ValueError(f"Missing required environment variable: {var}")
    
    # Database Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    
    # Fix Heroku's postgres:// URL to postgresql:// for SQLAlchemy
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # Configure database options based on database type
    if database_url.startswith('sqlite://'):
        # SQLite-specific options
        engine_options = {
            'connect_args': {
                'timeout': 15,
                'check_same_thread': False
            }
        }
    else:
        # PostgreSQL options (no timeout needed)
        engine_options = {}
    
    app.config.update(
        SECRET_KEY=os.environ['SECRET_KEY'],
        SQLALCHEMY_DATABASE_URI=database_url,
        SQLALCHEMY_ENGINE_OPTIONS=engine_options,
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Strict',
        PERMANENT_SESSION_LIFETIME=1800
    )
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    from prelaunch.routes.landing import landing
    app.register_blueprint(landing)
    
    # Create tables only if they don't exist
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully!")
        except Exception as e:
            print(f"Database tables may already exist: {str(e)}")
            # Continue anyway - tables might already be there
    
    print("ENV VARIABLES CHECK:")
    print("SECRET_KEY exists?", 'SECRET_KEY' in os.environ)
    
    # Add custom Jinja filters
    app.jinja_env.filters['datetimeformat'] = datetimeformat
    
    # HTTPS Redirection Middleware
    @app.before_request
    def redirect_to_https():
        # Only redirect in production (not in debug mode)
        if not app.debug:
            # Check if the request is not secure (HTTP) and not already on localhost
            if not request.is_secure and request.remote_addr != '127.0.0.1':
                # Replace http:// with https:// in the URL
                url = request.url.replace("http://", "https://", 1)
                return redirect(url, code=301)
    
    # Security headers - configure Talisman properly
    Talisman(
        app,
        content_security_policy={
            'default-src': "'self'",
            'script-src': [
                "'self'",
                "https://cdn.jsdelivr.net",
                "'unsafe-eval'"
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            'font-src': [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.gstatic.com",
                "data:"
            ],
            'img-src': [
                "'self'",
                "data:",
                "https://cdn.jsdelivr.net"
            ],
            'connect-src': [
                "'self'",
                "https://particles.js.org"
            ],
            'worker-src': [
                "'self'",
                "blob:"
            ]
        },
        content_security_policy_nonce_in=['script-src']
    )

    print("\n=== Application Initialization Complete ===")
    return app 

def datetimeformat(value, format='%B %d, %Y'):
    if value is None:
        return ""
    return value.strftime(format) 