# Generated by Django 3.1.7 on 2021-05-21 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0010_auto_20210521_2139'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfollowing',
            name='type',
            field=models.CharField(choices=[('family', 'family'), ('friend', 'friend'), ('close_friend', 'close friend'), ('unfamiliar_person', 'unfamiliar person')], default='unfamiliar_person', max_length=30),
        ),
    ]
