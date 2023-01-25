import os
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from functools import wraps
from dotenv import load_dotenv
from src.config.config_mongodb import ConfMongoDB as MongoConfig

### Cargar configuracion ###
load_dotenv(".env")
### Cargar App ###
app = Flask(__name__)

### CORS (Cross-Origin Resource Sharing) ### 
CORS(app, supports_credentials=True, origins="*", methods=["GET", "POST", "PUT", "DELETE"], headers="*")

### BASE DE DATOS ###
### MONGO DB ###
app.config.from_object(MongoConfig)
mongo = PyMongo(app)

### ROUTER ###
from src.home.routes import mod as mod_home
from src.usuarios.routes import mod as mod_usuarios

### BLUEPRINTS ###
app.register_blueprint(mod_home)
app.register_blueprint(mod_usuarios)