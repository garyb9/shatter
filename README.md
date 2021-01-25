# Shatter
Django REST API using React, Docker, Nginx and PostgreSQL.


## Development instructions (Docker)
**Required - Docker 20.10.2**

Run Docker, then:
```bash
git clone https://github.com/garyb9/Shatter.git
cd Shatter/
docker-compose up
```


## Development instructions (No-Docker)
**Required - Python 3.7.9, conda 4.8.4, Node.js 15.5.1**

1. First time:
- Use this env for all terminals/workdirs

```bash
git clone https://github.com/garyb9/Shatter.git
cd Shatter
conda create -n shatter
conda activate shatter
pip install -r backend/requirements.txt
```

2. Configuring PostgreSQL + CORS:
- Run pgAdmin4, make sure {your_db} is created
- Add a file called 'local_settings.py' inside backend/django_app/mainapp/ (change variables to string):
  
```python
# PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '{your_db}',
        'USER': '{your_user}',
        'PASSWORD': '{your_password}',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Cross-Origin Resource Sharing Settings (CORS) 
CORS_ORIGIN_ALLOW_ALL = True
```

3. Start development backend server:
- Backend server will run on http://127.0.0.1:8000/
```bash
cd backend/django_app/
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

4. Start development frontend server:
- Frontend server will run on http://127.0.0.1:3000/
```bash
cd frontend/react_app/
npm install
npm start
```
