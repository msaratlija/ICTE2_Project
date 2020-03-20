import pymongo
from config import Config
from mongoengine import connect


def mongoengine_connect_db ():
    connect(db=Config.DB_NAME,
            host=Config.MONGODB_URL)


def connect_db():
    client = pymongo.MongoClient(Config.MONGO_DB_URL)
    db = client.get_database(Config.DB_NAME)
    user_collection = pymongo.collection.Collection(db, Config.DB_COLLECTION)
    return db


