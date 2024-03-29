from django.urls import path
from rest_framework import routers

from backend.api.startup import startup_configuration
from backend.api.view.lobby_view import LobbyView
from backend.api.view.login_view import LoginView
from backend.api.view.logout_view import LogoutView
from backend.api.view.message_view import MessageView
from backend.api.view.settings_view import SettingsView
from backend.api.view.signup_view import SignUpView

startup_configuration.print_app_logo()
api_router = routers.DefaultRouter()

urlpatterns = [
    path("signup/<str:username>", SignUpView.as_view()),
    path("login/<str:username>", LoginView.as_view()),
    path("logout/<str:username>", LogoutView.as_view()),

    path("lobby/", LobbyView.as_view()),
    path("lobby/<str:name>", LobbyView.as_view()),

    path("message/", MessageView.as_view()),
    path("message/<str:game>", MessageView.as_view()),

    path("settings/", SettingsView.as_view()),
    path("settings/<str:username>", SettingsView.as_view()),

]
