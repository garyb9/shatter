# Shatter
Django REST API using React SPA's on Frontend, with Docker, Nginx and PostgreSQL.

## Development instructions
**Required - Python 3.7.9, conda 4.8.4, Node.js 15.5.1**

First time:
- $ git clone https://github.com/garyb9/Shatter.git
- $ cd Shatter/
- $ conda create -n shatter
- $ conda activate shatter
- $ pip install -r requirements.txt

In parallel / different terminals:
1. Configuring PostgreSQL + CORS:
  - add a file called 'settings_development.py' inside backend/django_app/mainapp:
    # PostgreSQL 
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': '{db_name}',
            'USER': '{your_user}',
            'PASSWORD': '{your_password}',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

    # Cross-Origin Resource Sharing Settings (CORS) 
    CORS_ORIGIN_ALLOW_ALL = True
   
  - Open pgAdmin4, make sure {db_name} is created
    
2. Start development backend server:
  - $ cd backend/django_app/
  - Optional: to populate db with fake users, run: & python populate_users.py
  - $ python manage.py migrate
  - $ python manage.py runserver

3. Start development frontend server:
  - $ cd frontend/react_app/
  - & npm install
  - & npm start


Development with DOCKER (run Docker + clone project):
- $ docker build .
- $ docker-compose build
- $ docker-compose up
