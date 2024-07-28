from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Quisition(models.Model):
    title = models.CharField(max_length=30)
    body = models.CharField(max_length=50)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class StatusOptions(models.TextChoices):
    DISLIKE = 'dislike', 'Dislike'
    LIKE = 'like', 'Like'

class Quisition_like(models.Model):
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    like_for = models.ForeignKey(Quisition,on_delete=models.CASCADE)
    status = models.CharField(choices=StatusOptions.choices,max_length=7)