# Generated by Django 3.1.7 on 2021-06-11 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0020_auto_20210603_0151'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='has_media',
            field=models.BooleanField(default=False),
        ),
    ]
