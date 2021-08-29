# Generated by Django 3.1.7 on 2021-05-27 10:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0013_auto_20210527_1332'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='retweet_from',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='retweet_of', to='twitcord_app.tweet'),
        ),
    ]