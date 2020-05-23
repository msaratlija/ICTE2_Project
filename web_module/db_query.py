from .model import User, UserDB, Consent
from datetime import datetime


def get_consents():
    return Consent.objects


def get_consents_by_user(user_obj):
    try:
        consent = Consent.objects(user=user_obj)
    except:
        consent = None
    return consent


def get_consent_by_id(con_id):
    try:
        consent = Consent.objects.get(id=con_id)
    except:
        consent = None
    return consent


def get_consent_by_url_and_user(con_url, user):
    try:
        consent = Consent.objects.get(url__exact=con_url, user=user)
    except:
        consent = None
    return consent


def update_or_modify_consent(con_json, user_obj):
    db_consent = get_consent_by_url_and_user(con_json["url"], user_obj)
    if db_consent is None:
        db_consent = Consent()
    user_db = get_user_by_username(con_json["user"])
    db_consent.user = user_db
    db_consent.title = con_json["title"]
    db_consent.url = con_json["url"]
    db_consent.text_elements = con_json["text_elements"]
    db_consent.click_elements = con_json["click_elements"]
    db_consent.date_created = datetime.now()
    db_consent.save()


def get_user_by_username(user_name):
    return UserDB.objects(username__exact=user_name).first()
