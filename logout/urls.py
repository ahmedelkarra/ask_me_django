from django.urls import path
from .views import Logout

urlpatterns = [
    path('logout/',Logout,name='logout')
]
