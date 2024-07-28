from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('home.urls')),
    path('api/auth/',include('login.urls')),
    path('api/auth/',include('register.urls')),
    path('api/auth/',include('me.urls')),
    path('api/auth/',include('logout.urls')),
    path('api/',include('quisition.urls')),
    path('api/',include('comment.urls')),
]
