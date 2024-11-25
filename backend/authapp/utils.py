import json
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["tekks"]
users_collection = db["users"]

# Function to register a user
def register_user(username, email, password):
    if users_collection.find_one({"username": username}):
        return {"success": False, "message": "Username already exists"}
    
    hashed_password = make_password(password)
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    })
    return {"success": True, "message": "User registered successfully"}

# Function to authenticate a user
def authenticate_user(username, password):
    user = users_collection.find_one({"username": username})
    if user and check_password(password, user["password"]):
        return {"success": True, "message": "Authentication successful", "user": {"username": user["username"], "email": user["email"]}}
    return {"success": False, "message": "Invalid username or password"}