from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_user, name='login'),
    path('google/', views.google_login, name='google_login'),
    # Refresh an expired access token using the long-lived refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
