from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from users.views import register_user

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', TokenObtainPairView.as_view() , name='login_user'),
    path('refresh_token/', TokenRefreshView.as_view(), name='refresh_token'),
]