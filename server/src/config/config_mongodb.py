import os
from pymongo import MongoClient
from dotenv import load_dotenv

### Cargar configuracion ###
load_dotenv(".env")
uri = None

### Configuracion de laa URI ###
try:
    if os.getenv('USER_MONGO') == '' and os.getenv('PASS_MONGO') == '':
        uri = '{}://{}:{}/{}'.format(
            os.getenv('TIPO_MONGO'),
            os.getenv('HOST_MONGO'),
            os.getenv('PORT_MONGO'),
            os.getenv('DB_MONGO')
        )
    else:
        uri = '{}://{}:{}@{}:{}/{}'.format(
        os.getenv('TIPO_MONGO'),
        os.getenv('USER_MONGO'),
        os.getenv('PASS_MONGO'),
        os.getenv('HOST_MONGO'),
        os.getenv('PORT_MONGO'),
        os.getenv('DB_MONGO')
    )
except Exception as e:
    print("Se ha producido un error al intentar crear la URI para Mongo DB...")

### Configuracion de la Base de Datos ###
class ConfMongoDB():
    MONGO_URI = uri
    client = MongoClient(MONGO_URI)
    DB = client.get_default_database()