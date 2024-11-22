from django.urls import path
from .views import tekks_list  # Import the tekks_list view

urlpatterns = [
    path('', tekks_list, name='tekks_list'),  # Empty string means it's mapped to 'api/tekks/'
]
