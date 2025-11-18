import os

from __init__ import create_prelaunch_app
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

# Load .env only when DATABASE_URL isn't provided (local development).
if not os.environ.get("DATABASE_URL"):
    load_dotenv()

app = create_prelaunch_app()
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Allow debug override via environment variable (default False in production).
app.debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"

# Render (and most PaaS) expose the desired port via the PORT environment variable.
HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "5001"))

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=app.debug)