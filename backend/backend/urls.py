from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def favicon_view(request):
    return HttpResponse(status=204)  # No content

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authapp.urls')),
    path('api/tekks/', include('recipes.urls')),  # Add trailing slash
    path('favicon.ico', favicon_view),  # Handle favicon requests
]
