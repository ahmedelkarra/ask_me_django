from django.urls import path
from .views import Home,Quisition


urlpatterns = [
    path('',Home,name='home'),
    path('profile',Home,name='home'),
    path('<str:id>',Quisition,name='Quisition'),
]
