from waitress import serve
from prelaunch import create_prelaunch_app
import os
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

# Only load .env file in development, not on Heroku
if not os.environ.get('DATABASE_URL'):
    load_dotenv()  # Load .env only for local development

app = create_prelaunch_app()
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
app.debug = True

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)  # Only local access 