import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.conf import settings
settings.ALLOWED_HOSTS.append('testserver')

from users.models import User

# Cleanup and create
User.objects.filter(username='testlecturer123').delete()
user = User.objects.create_user(username='testlecturer123', password='password123', role='lecturer')

client = Client()

# 1. Login
response = client.post('/api/auth/login/', {'username': 'testlecturer123', 'password': 'password123'}, content_type='application/json')
print("Login status:", response.status_code)
print("Login cookies:", client.cookies.keys() if client.cookies else "No cookies")

# 2. Get Courses
response_get = client.get('/api/courses/')
print("GET courses status:", response_get.status_code)

# 3. Create Course
response_post = client.post('/api/courses/create/', {'name': 'Test Course', 'description': 'desc'}, content_type='application/json')
print("POST create course status:", response_post.status_code)
if response_post.status_code >= 400:
    print("POST create course error:", response_post.json())

