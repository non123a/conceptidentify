from django.urls import include, path

from .views import (
    GoogleLoginView,
    LoginView,
    MeView,
    LogoutView,
    RegisterView,
)

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path(
        "register/",
        RegisterView.as_view(),
    ),
    path(
        "google/",
        GoogleLoginView.as_view()
    ),
]