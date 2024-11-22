from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user_view, name='register_user_view'),  # Correct URL pattern for registration
    path('login/', views.authenticate_user_view, name='authenticate_user_view'),  # Correct URL pattern for login
]
