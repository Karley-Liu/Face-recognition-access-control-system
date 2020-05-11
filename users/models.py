from django.db import models

# Create your models here.
class Users(models.Model):
    u_id = models.AutoField(primary_key=True)
    u_truename = models.CharField(max_length=255,null=False)
    u_phone = models.CharField(max_length=255,null=False,unique=True)
    u_password = models.CharField(max_length=255,null=False)
    u_house_number = models.CharField(max_length=255,null=False)
    u_car_number = models.CharField(max_length=255,null=True,unique=True)
    u_face = models.CharField(max_length=255,null=True)

    def __str__(self):
        return "<Users:({u_truename},{u_phone})>".format(u_truename=self.u_truename,u_phone=self.u_phone)