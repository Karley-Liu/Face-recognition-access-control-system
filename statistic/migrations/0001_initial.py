# Generated by Django 2.1.4 on 2020-03-25 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='statistic',
            fields=[
                ('s_id', models.AutoField(primary_key=True, serialize=False)),
                ('s_true', models.IntegerField(default=0, max_length=11)),
                ('s_false', models.IntegerField(default=0, max_length=11)),
            ],
        ),
    ]
