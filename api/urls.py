from django.urls import path

from api.views.auth_api import current_user

urlpatterns = [
    path('me/', current_user, name='current_user'),
]