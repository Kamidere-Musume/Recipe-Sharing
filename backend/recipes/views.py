from rest_framework.decorators import api_view
from pymongo import MongoClient
from math import ceil
from django.http import JsonResponse
from .recommendation import RecipeRecommender
from rest_framework.response import Response

mongo_uri = "mongodb://localhost:27017"
db_name = "tekks"
collection_name = "tekks"

recommender = RecipeRecommender(mongo_uri, db_name, collection_name)

client = MongoClient(mongo_uri)
db = client[db_name]
tekks_collection = db[collection_name]

@api_view(['GET'])
def tekks_list(request):
    try:
        page = int(request.query_params.get('page', 1))  # Default to page 1
        limit = 12  # Items per page
        skip = (page - 1) * limit

        # Fetch paginated data
        tekks = list(tekks_collection.find().skip(skip).limit(limit))
        total_tekks = tekks_collection.count_documents({})  # Total documents

        # Convert data to JSON-serializable format
        tekks_data = [
            {
                "id": str(tekk['_id']),  # ObjectId to string
                "title": tekk.get('title', ''),
                "url": tekk.get('url', ''),
                "ingredients": tekk.get('ingredients', []),
                "instructions": tekk.get('instructions', [])
            }
            for tekk in tekks
        ]

        # Pagination metadata
        total_pages = ceil(total_tekks / limit)
        metadata = {
            "current_page": page,
            "total_pages": total_pages,
            "total_tekks": total_tekks,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        }

        return Response({"metadata": metadata, "tekks": tekks_data})

    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def get_recommendations(request, recipe_id):
    try:
        # Load data and preprocess it
        recommender.load_data()
        recommender.preprocess_data()
        
        # Compute similarity matrix if not already computed
        if recommender.similarity_matrix is None:
            recommender.compute_similarity()

        # Get recommendations
        recommended_recipes = recommender.recommend_recipes(recipe_id)

        if recommended_recipes:
            # Convert the recommended recipes to a list of dictionaries that can be serialized
            recommended_recipes_list = [
                {
                    "id": str(recipe["_id"]),
                    "title": recipe.get('title', ''),
                    "image": recipe.get('image', ''),  # Ensure image is included
                    "description": recipe.get('description', ''),  # Ensure description is included
                    "url": recipe.get('url', ''),
                    "ingredients": recipe.get('ingredients', []),
                    "instructions": recipe.get('instructions', [])
                }
                for recipe in recommended_recipes
            ]
            return JsonResponse({'recommended_recipes': recommended_recipes_list}, safe=False)
        else:
            return JsonResponse({'error': 'Recipe ID not found or no recommendations available.'}, status=404)

    except Exception as e:
        return JsonResponse({'error': f'Error processing recommendations: {str(e)}'}, status=500)