from rest_framework.decorators import api_view
from rest_framework.response import Response
from pymongo import MongoClient

@api_view(['GET'])
def tekks_list(request):
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client.tekks_database  # MongoDB database
    tekks_collection = db.tekks  # MongoDB collection for Tekks

    try:
        # Fetch all tekks from MongoDB
        tekks = list(tekks_collection.find())

        # Convert Mongo ObjectId to string for JSON serialization
        tekks_data = [
            {
                "id": str(tekk['_id']),  # Convert ObjectId to string
                "title": tekk.get('title', ''),
                "url": tekk.get('url', ''),
                "ingredients": tekk.get('ingredients', []),
                "instructions": tekk.get('instructions', [])
            }
            for tekk in tekks
        ]

        return Response(tekks_data)

    except Exception as e:
        return Response({"error": str(e)}, status=400)
