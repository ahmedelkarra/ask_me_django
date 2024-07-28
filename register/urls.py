from .views import Register
from django.urls import path

urlpatterns = [
    path('register/',Register,name='register')
]
