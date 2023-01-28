# niv

## install

    create venv
    create db
    create .env
    pip install -r requirements.pip.txt
    python manage.py makemigrations
    python manage.py migrate

    npm i

## develop

    python manage.py runserver
    npm run serve

## proof of concept

find . -type f -name "_.html" -not -path "./node_modules/_" -exec js-beautify -r {} \;
