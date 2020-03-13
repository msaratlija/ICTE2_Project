from os import environ


class Config:
    # set environment variable in pycharm -> edit configuration
    SECRET_KEY = environ.get('SECRET_KEY')
    FLASK_NAME = 'ICTE_2'
