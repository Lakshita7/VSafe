from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Userprofileinfo(models.Model):
    user = models.OneToOneField(User,on_delete=models.PROTECT)

    #additional features
    profile_pic = models.ImageField(upload_to='profile_pics',blank=True)
    age = models.IntegerField()

    def __str__(self):
        return self.user.username
