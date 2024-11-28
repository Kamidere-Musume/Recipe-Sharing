import json
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["tekks"]
users_collection = db["users"]

# Function to register a user
def register_user(username, email, password):
    # Check if the username or email already exists
    if users_collection.find_one({"username": username}):
        return {"success": False, "message": "Username already exists"}
    if users_collection.find_one({"email": email}):
        return {"success": False, "message": "Email already registered"}
    
    # Hash the password for security
    hashed_password = make_password(password)
    
    # Insert a new user document with an empty comments array
    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "comments": []  # Initialize comments as an empty array
    }
    users_collection.insert_one(new_user)
    
    return {"success": True, "message": "User registered successfully"}

# Function to authenticate a user
def authenticate_user(username, password):
    # Fetch the user from the database
    user = users_collection.find_one({"username": username})
    user_id = str(user["_id"])
    if user and check_password(password, user["password"]):
        return {
            "success": True,
            "message": "Authentication successful",
            "user": {"username": user["username"], "email": user["email"], "user_id": user_id,}
        }
    return {"success": False, "message": "Invalid username or password"}
