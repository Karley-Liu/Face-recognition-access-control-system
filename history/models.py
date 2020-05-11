from django.db import models

# Create your models here.
class History(models.Model):
    h_id = models.AutoField(primary_key=True)
    h_username = models.CharField(max_length=100,null=False)
    h_house_number = models.CharField(max_length=100,null=False)
    h_datetime = models.DateTimeField(null=False)
    h_event = models.CharField(max_length=100)

    def __str__(self):
        return "<History:({h_username},{h_datetime})>".format(h_username = self.h_username,h_datetime = self.h_datetime)