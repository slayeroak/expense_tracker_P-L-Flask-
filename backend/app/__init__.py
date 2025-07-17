from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})


    from .routes.bookings import bookings_bp
    from .routes.clients import clients_bp
    from .routes.expenses import expenses_bp
    from .routes.expenses import expenses_bp

    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(expenses_bp, url_prefix='/api/expenses')


    return app