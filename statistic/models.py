from django.db import models

# Create your models here.
class Statistic(models.Model):
    s_id = models.AutoField(primary_key=True)
    s_true = models.IntegerField(default=0)
    s_false = models.IntegerField(default=0)

    def __str__(self):
        return "<Statistic:({s_true},{s_false})>".format(s_true = self.s_true,s_false = self.s_false)