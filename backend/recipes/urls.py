from django.urls import path
from .views import get_average_rating, tekks_list, get_recommendations, add_rating_and_comment, get_recipe_comments

urlpatterns = [
    path('', tekks_list, name='tekks_list'),
    path('recommendations/<str:recipe_id>/', get_recommendations, name='get_recommendations'),
    path('reviews/<str:user_id>/<str:recipe_id>/', add_rating_and_comment, name='add_comment'),
    path('comments/<str:recipe_id>/', get_recipe_comments, name='get_recipe_comments'),
    path('average-rating/<str:recipe_id>/', get_average_rating, name='get_average_rating'),
    ]
