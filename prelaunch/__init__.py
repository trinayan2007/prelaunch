from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
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
    required_env = ['SECRET_KEY', 'ENCRYPTION_KEY']
    for var in required_env:
        if not os.getenv(var):
            raise ValueError(f"Missing required environment variable: {var}")
    
    # Database Configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config.update(
        SECRET_KEY=os.environ['SECRET_KEY'],
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///site.db'),
        SQLALCHEMY_ENGINE_OPTIONS={
            'connect_args': {
                'timeout': 15,  # Increase timeout to 15 seconds
                'check_same_thread': False  # Allow access from multiple threads
            }
        },
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Strict',
        PERMANENT_SESSION_LIFETIME=1800,
        CSP={
            'default-src': "'none'",
            'script-src': [
                "'self'", 
                "https://cdnjs.cloudflare.com",
                "'strict-dynamic'",
                "'nonce-{nonce}'",
                "'unsafe-eval'"
            ],
            'style-src': [
                "'self'", 
                "https://fonts.googleapis.com", 
                "https://cdnjs.cloudflare.com",
                "'nonce-{nonce}'"
            ],
        }
    )
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    from prelaunch.routes.landing import landing
    app.register_blueprint(landing)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    print("ENV VARIABLES CHECK:")
    print("SECRET_KEY exists?", 'SECRET_KEY' in os.environ)
    print("ENCRYPTION_KEY exists?", 'ENCRYPTION_KEY' in os.environ)
    
    # Add custom Jinja filters
    app.jinja_env.filters['datetimeformat'] = datetimeformat
    
    # Security headers - configure Talisman properly
    Talisman(
        app,
        content_security_policy={
            'default-src': "'self'",
            'script-src': [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://www.googletagmanager.com",
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