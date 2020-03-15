from os import environ


class Config:
    # set environment variable in pycharm -> edit configuration
    SECRET_KEY = environ.get('SECRET_KEY')
    FLASK_NAME = 'ICTE_2'
    MONGODB_URL = environ.get('MONGODB_URL')
    MONGO_DB_URL = environ.get('MONGO_DB_URL')
    DB_NAME = 'consent_management'
    DB_COLL_USERS = 'users'
    SALT_LENGTH = 16
