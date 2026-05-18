from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('courses/', include('courses.urls')),
    path('users/', include('users.urls')),

    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),

    # JWT AUTH

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/', include('api.urls')),
]