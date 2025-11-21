"""
Script to initialize database tables in Railway PostgreSQL
Run this script with your Railway DATABASE_URL set as an environment variable
"""
from __init__ import create_prelaunch_app, db
from models.waiting_list import WaitingList  # Import models so SQLAlchemy knows about them
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_database():
    """Create all database tables"""
    app = create_prelaunch_app()
    
    with app.app_context():
        try:
            # Import all models first (already imported above, but ensure they're registered)
            # This ensures SQLAlchemy knows about all models before creating tables
            print("Creating database tables...")
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Verify tables were created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"\n📊 Created tables: {', '.join(tables)}")
            
            return True
        except Exception as e:
            print(f"❌ Error creating tables: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    # Check if DATABASE_URL is set
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ Error: DATABASE_URL environment variable not set!")
        print("Please set your Railway DATABASE_URL:")
        print("  Windows PowerShell: $env:DATABASE_URL='your_railway_url'")
        print("  Or create a .env file with: DATABASE_URL=your_railway_url")
        exit(1)
    
    print(f"🔗 Connecting to database: {database_url.split('@')[1] if '@' in database_url else 'database'}")
    print("")
    
    if init_database():
        print("\n✅ Database initialization complete!")
    else:
        print("\n❌ Database initialization failed!")
        exit(1)

