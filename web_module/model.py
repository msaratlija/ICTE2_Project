from flask_login import UserMixin
from mongoengine import *
from config import Config


class UserDB(UserMixin, Document):
    username = StringField(unique=True, required=True)
    password_hash = StringField(required=True)
    email = StringField()
    first_name = StringField()
    last_name = StringField()
    is_active = BooleanField()
    date_created = DateTimeField(required=True)
    role = StringField()
    meta = {'collection': Config.DB_COLL_USERS}


class Consent(Document):
    user = ReferenceField(UserDB)
    title = StringField()
    url = StringField()
    text_elements = ListField(StringField())
    click_elements = ListField(DictField())
    date_created = DateTimeField(required=True)
    meta = {'collection': 'consents'}


class User(UserMixin):
    def __init__(self, db_user=None):
        self.db_user = db_user
        if db_user is not None:
            self.id = db_user.id

    def is_active(self):
        return self.active

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def get_id(self):
        return str(self.id)

    def get_by_id(self, user_id):
        db_user = UserDB.objects.get(id=user_id)
        return self.set_values(db_user)

    def get_by_username(self, username):
        db_user = UserDB.objects(username__exact=username).first()
        return self.set_values(db_user)

    def set_values(self, db_user):
        if db_user:
            self.id = db_user.id
            self.db_user = db_user
            return self
        return None
