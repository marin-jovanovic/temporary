from django.apps import apps
from django.db import models

from backend.api.comm.comm import Notifier
from backend.api.model.users import get_user_model

game_created_notifier = Notifier()
game_left_notifier = Notifier()
game_join_notifier = Notifier()
games_notifier = Notifier()


class Post(models.Model):
    # primary key
    # id

    # alternate primary key

    # when user is deleted then delete all his posts
    owner = models.ForeignKey(get_user_model(),
                               on_delete=models.CASCADE)

    name = models.TextField(null=True)

    # todo ref
    date = models.TextField()
    time = models.TextField()
    geo_lat = models.TextField()
    geo_lon = models.TextField()

    capacity = models.IntegerField(null=True)
    description = models.TextField(null=True)
    reported = models.BooleanField(default=False)


def _get_post_model():
    return apps.get_model("api.post")

