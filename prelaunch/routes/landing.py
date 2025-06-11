from flask import Blueprint, render_template, request, jsonify, current_app
from prelaunch.models.waiting_list import WaitingList
from prelaunch import db
from datetime import datetime
import traceback
import bleach
from email_validator import validate_email as validate_email_, EmailNotValidError
import json

landing = Blueprint('landing', __name__)

@landing.route('/')
def index():
    with open('prelaunch/static/js/particles-config.json') as f:
        particles_config = json.load(f)
    
    particles_config['particles']['number']['value'] = 20
    particles_config['particles']['number']['density']['value_area'] = 150
    
    return render_template('landing/landing.html', 
                         particles_config=json.dumps(particles_config))

@landing.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy/privacy.html', 
                         current_year=datetime.utcnow().year,
                         effective_date=datetime.utcnow().strftime('%B %d, %Y'))

@landing.route('/terms-of-service')
def terms_of_service():
    return render_template('terms/terms.html')

@landing.route('/about')
def about():
    return render_template('aboutus/about.html')

@landing.route('/join-waiting-list', methods=['POST'])
def join_waiting_list():
    try:
        data = request.get_json()
        
        # Required field validation
        if not data.get('email'):
            return jsonify({"success": False, "message": "Email is required"}), 400
        if not data.get('userType'):
            return jsonify({"success": False, "message": "Please select a role"}), 400

        email = data.get('email')
        
        if WaitingList.query.filter_by(email=email).first():
            return jsonify({
                "success": False,
                "message": "✔️ You're already on the waitlist. We'll keep you updated!"
            }), 400
            
        # Add to database
        new_user = WaitingList(
            email=email,
            name=data.get('name'),
            user_type=data.get('userType')
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"success": True})
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


 