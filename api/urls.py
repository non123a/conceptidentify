from django.urls import path

from api.views.course_api import my_courses
from api.views.material_api import upload_material

urlpatterns = [
    path('courses/', my_courses, name='my_courses'),
    path('materials/upload/', upload_material, name='upload_material'),
]