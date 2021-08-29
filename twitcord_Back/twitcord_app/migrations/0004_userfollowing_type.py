# Generated by Django 3.1.7 on 2021-04-28 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twitcord_app', '0003_auto_20210422_1929'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfollowing',
            name='type',
            field=models.CharField(choices=[('family', 'family'), ('friend', 'friend'), ('close friend', 'close friend'), ('celebrity', 'celebrity'), ('familiar person', 'familiar person'), ('unfamiliar person', 'unfamiliar person')], default='unfamiliar person', max_length=30),
        ),
    ]