from django.db import models
from django.contrib.auth.models import User
from quisition.models import Quisition

# Create your models here.

class Comment(models.Model):
    body = models.CharField(max_length=50)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    comment_for = models.ForeignKey(Quisition,on_delete=models.CASCADE)

    def __str__(self):
        return self.body
    

class StatusOptions(models.TextChoices):
    DISLIKE = 'dislike', 'Dislike'
    LIKE = 'like', 'Like'

class Comment_like(models.Model):
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    like_for = models.ForeignKey(Comment,on_delete=models.CASCADE)
    status = models.CharField(choices=StatusOptions.choices,max_length=7)