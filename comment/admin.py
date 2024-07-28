from django.contrib import admin
from .models import Comment,Comment_like

# Register your models here.

admin.site.register(Comment)
admin.site.register(Comment_like)
