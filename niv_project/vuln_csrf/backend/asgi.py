import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path

from backend.api.consumer import  MessageConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.prod')

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter([
                    path('msg/', MessageConsumer().as_asgi()),

                ])
            )
        ),
    }
)
