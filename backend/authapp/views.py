import json
from django.http import JsonResponse
from .utils import register_user, authenticate_user

# Register User View
def register_user_view(request):
    if request.method == "POST":
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # Ensure all necessary fields are provided
            if not username or not email or not password:
                return JsonResponse({
                    "success": False, 
                    "message": "Username, email, and password are required"
                }, status=400)

            # Call the register_user function from utils.py
            result = register_user(username, email, password)
            return JsonResponse(result)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)

# Authenticate User View
def authenticate_user_view(request):
    if request.method == "POST":
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            # Ensure username and password are provided
            if not username or not password:
                return JsonResponse({
                    "success": False, 
                    "message": "Username and password are required"
                }, status=400)

            # Call the authenticate_user function from utils.py
            result = authenticate_user(username, password)
            
            # If authentication is successful, include a success message
            if result["success"]:
                return JsonResponse({
                    "success": True,
                    "message": "Login Successful",  # Added login success message
                    "user": result.get("user")  # Include user data if needed
                })
            else:
                return JsonResponse(result)  # Return the failure response from authenticate_user

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)
