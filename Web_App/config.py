from os import environ


class Config:
    FLASK_NAME = 'ICTE_2'
    SECRET_KEY = environ.get('SECRET_KEY')
    MONGODB_URL = environ.get('MONGODB_URL')
    MONGO_DB_URL = environ.get('MONGO_DB_URL')
    DB_NAME = 'consent_management'
    DB_COLL_USERS = 'users'
    SALT_LENGTH = 16
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'


def get_config():
    # set environment variable APP_ENV in pycharm -> edit configuration or linux server
    app_env = environ.get('APP_ENV')
    if app_env == 'linux':
        return Config
    return DevelopmentConfig
