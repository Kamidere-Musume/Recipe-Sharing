from django.urls import path
from .views import tekks_list, get_recommendations

urlpatterns = [
    path('', tekks_list, name='tekks_list'),
    path('recommendations/<str:recipe_id>/', get_recommendations, name='get_recommendations'),
]
