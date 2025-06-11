from prelaunch import db
from datetime import datetime
from email_validator import validate_email
from sqlalchemy.ext.hybrid import hybrid_property

class WaitingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)  # Changed to plain text
    name = db.Column(db.String(100), nullable=False)  # Changed to plain text
    user_type = db.Column(db.String(20), nullable=False)  # 'trader' or 'learner'
    joined_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    @hybrid_property
    def email_value(self):
        return self.email  # Directly return the column value

    @email_value.setter
    def email_value(self, value):
        if not validate_email(value):
            raise ValueError("Invalid email address")
        self.email = value

    def __repr__(self):
        return f'<WaitingList {self.email}>' 