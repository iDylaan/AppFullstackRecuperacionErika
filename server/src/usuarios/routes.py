from flask import Blueprint, request, jsonify, Response
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from src import mongo
from bson import json_util
from bson.objectid import ObjectId

# MODULE
mod = Blueprint('usuarios', __name__, 
    template_folder='templates', 
    static_folder='static', 
    static_url_path='/%s' % __name__
)

# CORS Configure Parameters
@mod.route('/users', methods=['OPTIONS'])
def handle_options():
    return "", 200, {
        "Access-Control-Allow-Origin": "*", # "*"
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

# ROUTES
@mod.route('/users', methods=['GET'])
def get_users():
    response = None
    try:
        users = mongo.db.users.find()
        response = json_util.dumps(users)
    except Exception as e:
        print("Ha sucedido un error en @users: {}".format(e))
    return Response(response, mimetype='application/json')


@mod.route('/users/<id>', methods=['GET'])
def get_user(id):
    res = None
    try:
        user = mongo.db.users.find_one({'_id': ObjectId( id )})
        if user:
            res = json_util.dumps(user)
        else:
            return user_not_found()
    except Exception as e:
        print("Ha sucedido el siguiente error en @users/{}: {}".format(str(id), e))
    return Response(res, mimetype='application/json')



@mod.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    res = None
    try:
        oid = ObjectId(id)
        user = mongo.db.users.find_one(oid)
        if user:
            mongo.db.users.delete_one({'_id': oid})
            message = {'message': 'User ' + id + ' was deleted successfully', 'status': 200}
            res = jsonify(message)
        else:
            return  user_not_found()
    except Exception as e:
        print('Ha sucedido un error al intentar eliminar en @users/{}: {}'.format(str(id), e))
    return res


@mod.route('/users/<id>', methods=['PUT'])
def update_user(id):
    res = None
    try:
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        title = request.json['title']
        area = request.json['area']
        state = request.json['state']
        level = request.json['level']
        if username and email and password:
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
                    'message': 'User ' + id + 'was updated successfully',
                    'status': 200
                }
            res = jsonify(message)
        else:
            return  not_found()
    except Exception as e:
        print('Ha ocurrido un error en @users: {}'.format(e))
    return res


@mod.route('/users', methods=['POST'])
def create_user():
    username = None
    email = None
    password = None

    try:
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        title = request.json['title']
        area = request.json['area']
        state = request.json['state']
        level = request.json['level']
        if username and email and password:
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
            result = mongo.db.users.insert_one(user)
            id = result.inserted_id
            response = {
                'id': str(id),
                'username': username,
                'email': email,
                'hashed_pass': hashed_pass,
                'title': title,
                'area': area,
                'state': state,
                'level': level
            }
            return response
        else:
            return  not_found()
    except Exception as e:
        print('Ha ocurrido un error en @users: {}'.format(e))
    return  {'message': 'recived'}


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