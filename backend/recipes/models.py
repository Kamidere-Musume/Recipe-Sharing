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

    def save(self):
        # Save this object to the MongoDB collection
        tekks_collection.insert_one({
            "title": self.title,
            "url": self.url,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
        })

    @classmethod
    def get_all(cls):
        # Fetch all recipes from the MongoDB collection
        return list(tekks_collection.find())

    @classmethod
    def get_by_id(cls, recipe_id):
        # Fetch a single recipe by its MongoDB _id
        return tekks_collection.find_one({"_id": recipe_id})
