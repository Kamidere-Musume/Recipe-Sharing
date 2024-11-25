from pymongo import MongoClient

# Initialize MongoDB client
client = MongoClient('mongodb://localhost:27017/')
db = client['tekk']  # Adjusted to match the actual database name
tekks_collection = db['tekks']  # Tekks collection in the tekk database

class Tekk:
    def __init__(self, title, url, ingredients, instructions):
        self.title = title
        self.url = url
        self.ingredients = ingredients
        self.instructions = instructions