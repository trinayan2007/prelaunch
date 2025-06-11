from waitress import serve
from prelaunch import create_prelaunch_app
import os
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

load_dotenv()  # Load .env before app creation

app = create_prelaunch_app()
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
app.debug = True

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)  # Only local access 