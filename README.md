# Earthshatter
Django REST API using React SPA's on Frontend, with PostgreSQL.

# Note - to view changes in React/Webpack, delete cookies or use incognito mode on localhost after running server and reload page.

Development NO-DOCKER:
1. $ git clone https://github.com/garyb9/Earthshatter.git
2. $ cd Earthshatter/src
3. $ python manage.py runserver
4. Goto: http://127.0.0.1:8000/

Development with DOCKER (run Docker):
1. $ git clone https://github.com/garyb9/Earthshatter.git
2. $ cd Earthshatter
3. $ docker build .
4. $ docker-compose build
5. $ docker-compose up
6. Goto: http://127.0.0.1:8000/
