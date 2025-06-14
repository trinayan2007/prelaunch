#!/usr/bin/env python3
"""
Test script to verify database functionality
"""

from prelaunch import create_app, db
from prelaunch.models.waiting_list import WaitingList

def test_database():
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if there are any existing entries
        existing_entries = WaitingList.query.all()
        print(f"Current entries in database: {len(existing_entries)}")
        
        if existing_entries:
            print("\nExisting entries:")
            for entry in existing_entries:
                print(f"- {entry.name} ({entry.email}) - {entry.user_type} - Joined: {entry.joined_at}")
        else:
            print("No entries found in database.")
        
        # Test adding a new entry
        try:
            test_entry = WaitingList(
                email="test@example.com",
                name="Test User",
                user_type="learner"
            )
            db.session.add(test_entry)
            db.session.commit()
            print("\n✅ Successfully added test entry to database!")
            
            # Verify it was added
            test_user = WaitingList.query.filter_by(email="test@example.com").first()
            if test_user:
                print(f"✅ Verified: {test_user.name} ({test_user.email}) - {test_user.user_type}")
            else:
                print("❌ Test entry not found in database")
                
        except Exception as e:
            print(f"❌ Error adding test entry: {e}")
            db.session.rollback()

if __name__ == "__main__":
    test_database() 