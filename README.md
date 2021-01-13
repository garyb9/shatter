# Earthshatter
Django REST API using React SPA's on Frontend, with PostgreSQL.


***To view changes in React after compiling Webpack ->***
***Delete cookies or use incognito mode on localhost after running server and reload page.***


## Development instructions
Development NO-DOCKER:
1. $ git clone https://github.com/garyb9/Earthshatter.git
2. $ cd Earthshatter/src/frontend
3. $ npm install
4. $ npm run dev
5. $ cd ../
6. $ python manage.py runserver
7. Goto: http://127.0.0.1:8000/

Development with DOCKER (run Docker + clone project):
1. $ cd Earthshatter
2. $ docker build .
3. $ docker-compose build
4. $ docker-compose up
5. Goto: http://127.0.0.1:8000/
