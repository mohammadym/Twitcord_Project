# Generated by Django 3.1.7 on 2021-04-22 14:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0002_auto_20210421_1915'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userfollowing',
            old_name='following_user_id',
            new_name='following_user',
        ),
        migrations.RenameField(
            model_name='userfollowing',
            old_name='user_id',
            new_name='user',
        ),
    ]
