from pymongo import MongoClient
from bson.objectid import ObjectId

# Initialize MongoDB client
client = MongoClient('mongodb://localhost:27017/')
db = client['tekk']  # Database name
tekks_collection = db['tekks']  # Collection name

class Tekk:
    def __init__(self, title=None, url=None, ingredients=None, instructions=None, _id=None):
        self.title = title
        self.url = url
        self.ingredients = ingredients if ingredients else []
        self.instructions = instructions if instructions else []
        self._id = _id  # MongoDB document ID (if editing an existing record)

    def save(self):
        """
        Save this object to the MongoDB collection.
        If `_id` is present, update the existing record; otherwise, create a new one.
        """
        data = {
            "title": self.title,
            "url": self.url,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
        }
        if self._id:
            # Update an existing document
            result = tekks_collection.update_one({"_id": ObjectId(self._id)}, {"$set": data})
            return result.modified_count > 0  # Return True if modified
        else:
            # Insert a new document
            result = tekks_collection.insert_one(data)
            self._id = result.inserted_id
            return True

    @classmethod
    def get_all(cls):
        """
        Fetch all recipes from the MongoDB collection.
        Returns a list of Tekk objects.
        """
        recipes = tekks_collection.find()
        return [cls(**recipe, _id=str(recipe["_id"])) for recipe in recipes]

    @classmethod
    def get_by_id(cls, recipe_id):
        """
        Fetch a single recipe by its MongoDB _id.
        Returns a Tekk object or None if not found.
        """
        try:
            recipe = tekks_collection.find_one({"_id": ObjectId(recipe_id)})
            if recipe:
                return cls(**recipe, _id=str(recipe["_id"]))
            return None
        except Exception as e:
            print(f"Error fetching recipe by ID: {e}")
            return None

    @classmethod
    def delete_by_id(cls, recipe_id):
        """
        Delete a recipe by its MongoDB _id.
        Returns True if the document was deleted, otherwise False.
        """
        try:
            result = tekks_collection.delete_one({"_id": ObjectId(recipe_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting recipe by ID: {e}")
            return False

    def to_dict(self):
        """
        Convert the Tekk object to a dictionary.
        Useful for serialization or debugging.
        """
        return {
            "title": self.title,
            "url": self.url,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
            "_id": str(self._id) if self._id else None,
        }

# Example usage:
if __name__ == "__main__":
    # Create a new recipe
    new_recipe = Tekk(
        title="Spaghetti Carbonara",
        url="https://example.com/carbonara.jpg",
        ingredients=["Spaghetti", "Eggs", "Pancetta", "Parmesan Cheese"],
        instructions=["Boil pasta", "Cook pancetta", "Mix with eggs and cheese"],
    )
    new_recipe.save()
    print(f"Saved recipe with ID: {new_recipe._id}")

    # Fetch all recipes
    recipes = Tekk.get_all()
    print("All recipes:", [recipe.to_dict() for recipe in recipes])

    # Fetch a specific recipe by ID
    if recipes:
        recipe_id = recipes[0]._id
        fetched_recipe = Tekk.get_by_id(recipe_id)
        print("Fetched recipe:", fetched_recipe.to_dict() if fetched_recipe else "Not found")

    # Delete a recipe by ID
    if recipes:
        delete_success = Tekk.delete_by_id(recipe_id)
        print(f"Recipe with ID {recipe_id} deleted: {delete_success}")
