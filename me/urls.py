from .views import Me,edit_user
from django.urls import path

urlpatterns = [
    path('me/',Me,name='me'),
    path('me/<str:id>',edit_user,name='edit_user')
]
