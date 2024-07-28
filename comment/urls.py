from django.urls import path
from .views import comment_api,comment_like_api,comment_api_options


urlpatterns = [
    path('quisition/comment/<str:id>/',comment_api,name='comment'),
    path('quisition/comment/like/<str:id>/',comment_like_api,name='comment_like_api'),
    path('quisition/comment/<str:id>/<str:comment_id>/',comment_api_options,name='comment_api_options'),
]
