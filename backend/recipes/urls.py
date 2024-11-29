from django.urls import path
from .views import tekks_list, get_recommendations, add_rating_and_comment

urlpatterns = [
    path('', tekks_list, name='tekks_list'),
    path('recommendations/<str:recipe_id>/', get_recommendations, name='get_recommendations'),
    path('reviews/<str:user_id>/<str:recipe_id>/', add_rating_and_comment, name='add_comment'),
    ]
