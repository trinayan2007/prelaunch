from prelaunch import create_prelaunch_app, db
from prelaunch.models.waiting_list import WaitingList
import time
import os

app = create_prelaunch_app()

def recreate_database():
    max_retries = 3
    retry_delay = 2  # seconds
    
    for attempt in range(max_retries):
        try:
            with app.app_context():
                # Drop all tables
                db.drop_all()
                
                # Create all tables
                db.create_all()
                
                print("Database tables dropped and recreated successfully!")
                return True
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Waiting {retry_delay} seconds before retrying...")
                time.sleep(retry_delay)
            else:
                print("All attempts failed. Please make sure no other process is using the database.")
                return False

if __name__ == "__main__":
    # Check if we're using SQLite (local development)
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
    if database_url.startswith('sqlite:///'):
        # Only try to delete SQLite file if we're using SQLite
        db_path = os.path.join('prelaunch', 'waiting_list.db')
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
                print("Old SQLite database file removed.")
            except Exception as e:
                print(f"Could not remove old database file: {str(e)}")
    else:
        print("Using PostgreSQL database (Heroku environment)")
    
    # Recreate the database
    recreate_database() 