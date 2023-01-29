user_schema = {
    "id": {
        "type": "string",
        "required": False,
        "empty": True
    },
    "username": {
        "type": "string",
        "required": True,
        "empty": False
    },
    "email": {
        "type": "string",
        "required": True,
        "empty": False,
        "regex": "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    },
    "password": {
        "type": "string",
        "required": True,
        "empty": False,
        "minlength": 6
    },
    "title": {
        "type": "string",
        "required": True,
        "empty": False,
    },
    "area": {
        "type": "string",
        "required": True,
        "empty": False
    },
    "state": {
        "type": "string",
        "required": True,
        "empty": False
    },
    "level": {
        "type": "string",
        "required": True,
        "empty": False
    },
    "review": {
        "required": False
    }
}