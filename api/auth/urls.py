from django.urls import include, path
from .views import (
    LoginView,
    MeView,
)

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
]