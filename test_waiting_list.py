#!/usr/bin/env python3
"""
Test script for waiting list functionality
"""
import requests
import json
import time

def test_waiting_list():
    base_url = "http://127.0.0.1:5001"  # Local development server
    
    print("🧪 Testing Waiting List Functionality")
    print("=" * 50)
    
    # Test data
    test_users = [
        {
            "name": "John Trader",
            "email": "john@example.com",
            "userType": "trader"
        },
        {
            "name": "Jane Learner", 
            "email": "jane@example.com",
            "userType": "learner"
        },
        {
            "name": "Bob Smith",
            "email": "bob@example.com", 
            "userType": "trader"
        }
    ]
    
    for i, user in enumerate(test_users, 1):
        print(f"\n📝 Test {i}: Adding user {user['name']}")
        
        try:
            response = requests.post(
                f"{base_url}/join-waiting-list",
                json=user,
                headers={'Content-Type': 'application/json'}
            )
            
            result = response.json()
            
            if response.status_code == 200 and result.get('success'):
                print(f"✅ Success: {user['name']} added to waitlist")
            elif response.status_code == 400 and "already on the waitlist" in result.get('message', ''):
                print(f"ℹ️  Info: {user['name']} already on waitlist")
            else:
                print(f"❌ Error: {result.get('message', 'Unknown error')}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: Cannot connect to server. Make sure the Flask app is running.")
            return
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Testing Complete!")
    print("\nTo view the data:")
    print("1. Start your Flask app: python run_prelaunch.py")
    print("2. Visit: http://127.0.0.1:5001/admin")
    print("3. Login with: admin / admin123")
    print("\nOr use the API endpoint:")
    print("curl -X GET http://127.0.0.1:5001/admin/api/waiting-list")

if __name__ == "__main__":
    test_waiting_list() 