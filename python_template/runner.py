from db_adapter.manual_settings import initialize_django
from db_adapter.manual_settings import get_module_name

"""runner for creating models in database using django"""

get_module_name()

def main():
    initialize_django()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    args = ['manage.py', 'makemigrations', get_module_name()]
    execute_from_command_line(args)

    args = ['manage.py', 'migrate']
    execute_from_command_line(args)


if __name__ == '__main__':
    main()
