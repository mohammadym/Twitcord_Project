# Generated by Django 3.1.7 on 2021-06-01 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0017_auto_20210528_2259'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='tweet',
            name='content_null',
        ),
        migrations.AddConstraint(
            model_name='tweet',
            constraint=models.CheckConstraint(check=models.Q(models.Q(('retweet_from__isnull', True), ('content__isnull', False)), ('retweet_from__isnull', False), _connector='OR'), name='content_null'),
        ),
    ]
