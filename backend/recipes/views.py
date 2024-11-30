import logging
from venv import logger
from rest_framework.decorators import api_view
from pymongo import MongoClient
from math import ceil
from django.http import JsonResponse
from .recommendation import RecipeRecommender
from rest_framework.response import Response
from bson import ObjectId
import json
from django.views.decorators.csrf import csrf_exempt

mongo_uri = "mongodb://localhost:27017"
db_name = "tekks"
collection_name = "tekks"
recommender = RecipeRecommender(mongo_uri, db_name, collection_name)
client = MongoClient(mongo_uri)
db = client[db_name]
tekks_collection = db[collection_name]
users_collection = db['users']

@api_view(['GET'])
def tekks_list(request):
    try:
        page = int(request.query_params.get('page', 1))  # Default to page 1
        search_query = request.query_params.get('search', '')  # Get search query
        limit = 12  # Items per page
        skip = (page - 1) * limit

        # Build search query if search term is provided
        if search_query:
            # Perform search based on the title field
            tekks = list(tekks_collection.find({
                "title": {"$regex": search_query, "$options": "i"}
            }).skip(skip).limit(limit))
        else:
            # If no search term, fetch all tekks
            tekks = list(tekks_collection.find().skip(skip).limit(limit))

        total_tekks = tekks_collection.count_documents({
            "title": {"$regex": search_query, "$options": "i"} if search_query else {}
        })  # Count documents based on search query

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
    
logger = logging.getLogger(__name__)

def add_rating_and_comment(request, user_id, recipe_id):
    try:
        logger.debug(f"Received request body: {request.body}")
        
        # Ensure user_id and recipe_id are valid ObjectIds
        try:
            user_id_object = ObjectId(user_id)
            recipe_id_object = ObjectId(recipe_id)
        except Exception as e:
            logger.error(f"Invalid user or recipe ID: {e}")
            return JsonResponse({"success": False, "message": "Invalid user or recipe ID."}, status=400)

        # Log the user_id being used for lookup
        logger.debug(f"Looking for user with user_id: {user_id_object}")

        # Fetch user from the database
        user = users_collection.find_one({"_id": user_id_object})
        
        # Log whether the user was found or not
        if not user:
            logger.error(f"User not found: {user_id_object}")
            return JsonResponse({"success": False, "message": "User not found."}, status=404)

        # Parse the JSON body
        data = json.loads(request.body)
        logger.debug(f"Parsed request data: {data}")

        rating = data.get("rating")
        comment = data.get("comment")

        if rating is None:
            return JsonResponse({"success": False, "message": "Rating is required and must be a number."}, status=400)

        rating = float(rating)  # Convert rating to float

        # Check if recipe exists
        recipe = tekks_collection.find_one({"_id": recipe_id_object})
        if not recipe:
            logger.error(f"Recipe not found: {recipe_id_object}")
            return JsonResponse({"success": False, "message": "Recipe not found."}, status=404)

        # Create a new comment object
        new_comment = {
            "recipe_id": recipe_id_object,
            "rating": rating,
            "comment": comment,
            "date": "2024-11-29T14:00:00Z"  # You can use current timestamp here
        }

        # Add the new comment to the user's comment array
        users_collection.update_one(
            {"_id": user_id_object},
            {"$push": {"comments": new_comment}}
        )

        # Recalculate the user's average rating based on all their ratings
        comments = users_collection.find_one({"_id": user_id_object}).get("comments", [])
        ratings = [c['rating'] for c in comments]
        if ratings:
            average_rating = sum(ratings) / len(ratings)
        else:
            average_rating = 0

        # Update the user's average rating
        users_collection.update_one(
            {"_id": user_id_object},
            {"$set": {"average_rating": average_rating}}
        )

        # Successful response
        return JsonResponse({"success": True, "message": "Rating and comment added successfully."})

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    

@api_view(['GET'])
def get_recipe_comments(request, recipe_id):
    try:
        # Ensure recipe_id is a valid ObjectId
        recipe_id_object = ObjectId(recipe_id)
    except Exception as e:
        return JsonResponse({"success": False, "message": "Invalid recipe ID."}, status=400)

    # Find all comments for the recipe
    comments = users_collection.aggregate([
        {"$unwind": "$comments"},  # Flatten the comments array
        {"$match": {"comments.recipe_id": recipe_id_object}},  # Match by recipe_id
        {
            "$project": {
                "_id": 0,
                "username": "$username",
                "rating": "$comments.rating",
                "comment": "$comments.comment",
                "date": "$comments.date"
            }
        }
    ])

    # Convert cursor to a list
    comments_list = list(comments)
    return JsonResponse({"success": True, "comments": comments_list})



@api_view(['GET'])
def get_average_rating(request, recipe_id):
    try:
        # Ensure `recipe_id` is a valid ObjectId
        recipe_id_object = ObjectId(recipe_id)
    except Exception as e:
        return JsonResponse({"success": False, "message": "Invalid recipe ID."}, status=400)

    # Find all users who have rated the recipe and calculate the average rating
    users_with_ratings = users_collection.aggregate([
        {"$unwind": "$comments"},  # Flatten the comments array
        {"$match": {"comments.recipe_id": recipe_id_object}},  # Match by recipe_id
        {"$group": {
            "_id": None,
            "average_rating": {"$avg": "$comments.rating"}
        }}
    ])

    average_rating_result = list(users_with_ratings)

    if average_rating_result:
        return JsonResponse({"success": True, "average_rating": average_rating_result[0]["average_rating"]})
    else:
        return JsonResponse({"success": True, "average_rating": 0}) 
