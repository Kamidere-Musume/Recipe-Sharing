from django.core.mail import send_mail
from django.http import JsonResponse
from django.conf import settings
import json

def send_contact_form(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')
            google_id = data.get('google_id')  # Capture the Google ID

            # You can also validate the data here if needed

            # Send email
            send_mail(
                subject=f"Contact Form Submission from {name}",
                message=f"Name: {name}\nEmail: {email}\nGoogle ID: {google_id}\nMessage: {message}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['annoyedflake@gmail.com'],
                fail_silently=False,
            )

            return JsonResponse({'success': True, 'message': 'Message sent successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method'})
