import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from users.models import User

# Cleanup and create
User.objects.filter(username='teststudent123').delete()
user = User.objects.create_user(username='teststudent123', password='password123', role='student')

client = Client()

client.post('/api/auth/login/', {'username': 'teststudent123', 'password': 'password123'}, content_type='application/json')
response_post = client.post('/api/courses/create/', {'name': 'Test', 'description': 'desc'}, content_type='application/json')
print("Status:", response_post.status_code)
