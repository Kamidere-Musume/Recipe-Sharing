from rest_framework.decorators import api_view
from rest_framework.response import Response
from pymongo import MongoClient
from math import ceil

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['tekks']  # Updated database name
tekks_collection = db['tekks']  # Collection for recipes

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
