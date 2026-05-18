from django.urls import path

from api.views.auth_api import current_user
from api.views.course_api import my_courses
from api.views.material_api import upload_material

urlpatterns = [
    path('me/', current_user, name='current_user'),
    path('courses/', my_courses, name='my_courses'),
    path('materials/upload/', upload_material, name='upload_material'),
]