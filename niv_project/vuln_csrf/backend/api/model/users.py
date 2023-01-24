from django.apps import apps
from django.db import models



class Users(models.Model):
    """
    when user creates game
    game_role = "creator"

    when user join game
    game_role = "joined"
    """

    # alternate primary key
    username = models.TextField()

    password_hash = models.TextField()
    access_token = models.TextField(null=True)

    profile_picture = models.TextField(null=True)

    game_role = models.TextField(null=True)


def get_user_model():
    return apps.get_model("api.Users")
