from pathlib import Path

import django
from decouple import config
from django.conf import settings

from db_adapter.comm_postgres import create_database


def get_module_name():
    return Path(__file__).resolve().parent.stem


def initialize_django():
    create_database()

    if settings.configured:
        print('already configured')
        return

    print('configuration')

    settings.configure(
        INSTALLED_APPS=[
            get_module_name(),
        ],
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': config("DB_NAME"),
                'USER': config("DB_USER"),
                'PASSWORD': config("DB_PASSWORD"),
                'HOST': config("DB_HOST"),
                'PORT': config("DB_PORT"),
            }
        },
        DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
    )

    django.setup()
