import json
from flask import Blueprint, request, jsonify, Response
from flask_cors import cross_origin, CORS
from cerberus import Validator
from werkzeug.security import generate_password_hash, check_password_hash
from src import mongo
from bson import json_util
from bson.objectid import ObjectId
from .schemas import user_schema

# TODO: Loggear todos los excepts

# MODULE
mod = Blueprint('usuarios', __name__, 
    template_folder='templates', 
    static_folder='static', 
    static_url_path='/%s' % __name__
)
# CORS acces to "users"
CORS(mod)

# CORS Configure Parameters
@mod.route('/users', methods=['OPTIONS'])
def handle_options():
    return "", 200, {
        "Access-Control-Allow-Origin": "*", # "*"
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }


# Schemas validate
def val_req_data(data, schema): # validate request data
    v = Validator(schema)
    if not v.validate(data):
        return jsonify({"errors": v.errors}), 400
    return None


# ROUTES
@mod.route('/users', methods=['GET'])
def get_users():
    res = None
    try:
        users_res = []
        users = mongo.db.users.find()
        res = json_util.dumps(users)
        users = json.loads(res)
        for user in users:
            user_id = dict(user['_id'])
            oid = user_id['$oid']
            users_res.append({
                "id": oid,
                "username": user['username'],
                "email": user['email'],
                "password": user['password'],
                "title": user['title'],
                "area": user['area'],
                "state": user['state'],
                "level": user['level'] 
            })
        return jsonify(users_res)
    except Exception as e:
        print("Ha sucedido un error en @users: {}".format(e))
    if not res:
        return jsonify({ "message": "Error inesperado en el servidor", "status": 500 })



@mod.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    res = None
    try:
        user = mongo.db.users.find_one({'_id': ObjectId( id )})
        if user:
            res = json_util.dumps(user)
        else:
            return user_not_found()
        return res
    except Exception as e:
        print("Ha sucedido el siguiente error en @users/{}: {}".format(str(id), e))
    if not res:
        return jsonify({ "message": "Error inesperado en el servidor", "status": 500 })



@mod.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    res = None
    try:
        user = mongo.db.users.find_one(ObjectId( id ))
        if user:
            mongo.db.users.delete_one({'_id': ObjectId( id )})
            message = {'message': 'User {} was deleted successfully'.format( id ), 'status': 200}
            return jsonify(message)
        else:
            return  user_not_found()
    except Exception as e:
        print('Ha sucedido un error al intentar eliminar en @users/{}: {}'.format(str(id), e))
    if not res:
        return jsonify({ "message": "Error inesperado en el servidor", "status": 500 })


@mod.route('/users/<string:id>', methods=['PUT'])
def update_user(id):
    res = None
    try:
        data = request.get_json()
        errors = val_req_data(data, user_schema)

        if errors:
            print(errors)
            return {"errors": errors}, 400

        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        title = request.json['title']
        area = request.json['area']
        state = request.json['state']
        level = request.json['level']
        if data:
            hashed_pass = generate_password_hash(password)
            result = mongo.db.users.update_one({'_id': ObjectId( id )},{'$set': {
                'username': username,
                'email': email,
                'password': hashed_pass,
                'title': title,
                'area': area,
                'state': state,
                'level': level
            }})
            message = {
                    "message": 'User {} was updated successfully'.format( id ),
                    'status': 200
                }
            return jsonify(message)
        else:
            return  not_found()
    except Exception as e:
        print('Ha ocurrido un error en @users: {}'.format(e))
    if not res:
        return jsonify({ "message": "Error inesperado en el servidor", "status": 500 })


@mod.route('/users', methods=['POST'])
def create_user():
    res = None
    try:
        data = request.get_json()
        errors = val_req_data(data, user_schema)

        if errors:
            print(errors)
            return {"errors": errors}, 400

        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        title = request.json['title']
        area = request.json['area']
        state = request.json['state']
        level = request.json['level']
        
        if data:
            hashed_pass = generate_password_hash(password)
            user = {
                'username': username,
                'email': email,
                'password': hashed_pass,
                'title': title,
                'area': area,
                'state': state,
                'level': level 
            }
            result = mongo.db.users.insert_one( user )
            id = result.inserted_id
            res = {
                'id': str(id),
                'username': username,
                'email': email,
                'hashed_pass': hashed_pass,
                'title': title,
                'area': area,
                'state': state,
                'level': level
            }
            return jsonify(res)
        else:
            return  not_found()
    except Exception as e:
        print('Ha ocurrido un error en @users: {}'.format(e))
    if not res:
        return jsonify({ "message": "Error inesperado en el servidor", "status": 500 })


@mod.errorhandler(404)
def user_not_found(error=None):
    res = jsonify({
        'message': 'User Not Found',
        'status': 404
    })
    res.status_code = 404
    return res

@mod.errorhandler(404)
def not_found(error=None):
    res = jsonify({
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    })
    res.status_code = 404
    return res