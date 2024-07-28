from django.urls import path
from .views import quisition_api,quisition_all_info,quisition_api_like


urlpatterns = [
    path('quisition/',quisition_api,name='quisition'),
    path('quisition/all/',quisition_all_info,name='quisition_AllInfo'),
    path('quisition/like/<str:id>/',quisition_api_like,name='quisition_api_like'),
]