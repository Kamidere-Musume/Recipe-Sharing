from django.urls import path
from .views import send_contact_form

urlpatterns = [
    path('send-message/', send_contact_form, name='send_message'),
]
