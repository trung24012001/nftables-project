from flask import Flask
from src.service.service import main_api
import os
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    # Initialize Config
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY"),
        SQLALCHEMY_DATABASE_URI=os.environ.get("SQLALCHEMY_DB_URI"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY"),
    )
    app.register_blueprint(main_api, url_prefix="/api")

    return app
