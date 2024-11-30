from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authapp.urls')),
    path('api/tekks/', include('recipes.urls')), 
    path('contact/', include('contact.urls')),  # Use /contact/ instead of /api/
]
