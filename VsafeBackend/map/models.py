from django.db import models

# Create your models here.
class area(models.Model):
    area=models.CharField(max_length=200)
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )
    rate=models.IntegerField(choices=RATING_CHOICES,default=3)
