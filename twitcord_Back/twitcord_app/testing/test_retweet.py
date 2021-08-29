from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import Tweet, Like
from rest_framework import serializers


class RetweetTest(APITestCase):
    def setUp(self):
        twitcord_user = get_user_model()
        self.user1 = twitcord_user.objects.create(username='test1', email='test1@gmail.com', password='testpass')
        self.user2 = twitcord_user.objects.create(username='test2', email='test2@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.tweet1 = models.Tweet.objects.create(user=self.user2, content='test2')

    def test_retweet(self):
        url = '/tweets/{}/retweet/'.format(self.tweet1)
        self.maxDiff = None
        data = {
            "content": "first retweet",
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "id": 2,
            "create_date": serializers.DateTimeField().to_representation(response.data['create_date']),
            "content": "first retweet",
            "user": {
                "username": "test1",
                "date_joined": response.data['user']['date_joined'],
                "first_name": None,
                "last_name": None,
                "birth_date": None,
                "is_public": False,
                "profile_img": None,
                "header_img": None,
                "id": 2
            },
            "retweet_from": {
                "id": 1,
                "content": "test2",
                "create_date": serializers.DateTimeField().to_representation(response.data['retweeted_from']['create_date']),
                "user": {
                    "username": "test2",
                    "date_joined": response.data['retweeted_from']['user']['date_joined'],
                    "first_name": None,
                    "last_name": None,
                    "birth_date": None,
                    "is_public": False,
                    "profile_img": None,
                    "header_img": None,
                    "id": 2
                },
                "is_retweeted": True,
                "is_liked": False,
                "like_count": 0,
                "reply_count": 0,
                "retweet_count": 1
            }
        }
        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        result['results']['user'] = dict(result['results']['user'])
        result['results']['retweet_from'] = dict(result['results']['retweet_from'])
        result['results']['retweet_from']['user'] = dict(result['results']['retweet_from']['user'])
        self.assertEqual(result, data)
