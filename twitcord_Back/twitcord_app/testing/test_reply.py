from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import Tweet, Like
from rest_framework import serializers


class ReplyTest(APITestCase):

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.tweet = models.Tweet.objects.create(user=self.user, content='salam')

        self.user1 = twitcord_user.objects.create(username='test1', email='test1@gmail.com', password='testpass')
        self.user2 = twitcord_user.objects.create(username='test2', email='test2@gmail.com', password='testpass')
        self.user3 = twitcord_user.objects.create(username='test3', email='test3@gmail.com', password='testpass')

    def test_reply(self):
        url = '/reply/'
        self.maxDiff = None
        data = {
            "content": "reply1",
            "parent": self.tweet.id
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        create_date = serializers.DateTimeField().to_representation(response.data['create_date'])

        response_data = {
            "id": 3,
            "is_reply": True,
            "retweet_from": None,
            "content": "reply1",
            "create_date": create_date,
            "has_media": False,
            "parent": {
                'id': 2,
                'content': 'salam',
                'create_date': response.data['parent']['create_date'],
                'is_retweeted': False,
                'user':
                    {'is_liked': False,
                     'user_id': 30,
                     'username': 'test',
                     'first_name': None,
                     'last_name': None,
                     'is_public': True,
                     'profile_img': None,
                     'header_img': None
                     },
                'like_count': 0,
                'reply_count': 1,
                'retweet_count': 0
            },
            'user':
                {
                    'username': 'test',
                    'date_joined': self.user.date_joined,
                    'first_name': None,
                    'last_name': None,
                    'birth_date': None,
                    'is_public': True,
                    'profile_img': None,
                    'header_img': None,
                    'id': 30
                },
            'is_retweeted': False,
            'is_liked': False,
            'like_count': 0,
            'reply_count': 0,
            'retweet_count': 0
        }

        time1 = response.data['parent']['create_date']
        self.assertEqual(response.data, response_data)

        self.assertEqual(len(models.Tweet.objects.filter(parent=self.tweet.id)), 1)

        url = '/replys/{}/?page=1'.format(self.user.id)
        response = self.client.get(url, content_type='application/json')
        data = {
            'count': 1,
            'next': None,
            'previous': None,
            'results':
                {
                    'id': 3,
                    'is_reply': True,
                    'retweet_from': None,
                    'content': 'reply1',
                    'create_date': create_date,
                    'has_media': False,
                    'parent':
                        {
                            'id': 2,
                            'content': 'salam',
                            'create_date': time1,
                            'is_retweeted': False,
                            'user':
                                {
                                    'is_liked': False,
                                    'user_id': 30,
                                    'username': 'test',
                                    'first_name': None,
                                    'last_name': None,
                                    'is_public': True,
                                    'profile_img': None,
                                    'header_img': None
                                },
                            'like_count': 0,
                            'reply_count': 1,
                            'retweet_count': 0
                        },
                    'user':
                        {
                            'username': 'test',
                            'date_joined': response.data['results'][0]['user']['date_joined'],
                            'first_name': None,
                            'last_name': None,
                            'birth_date': None,
                            'is_public': True,
                            'profile_img': None,
                            'header_img': None,
                            'id': 30
                        },
                    'is_retweeted': False,
                    'is_liked': False,
                    'like_count': 0,
                    'reply_count': 0,
                    'retweet_count': 0
                }
        }

        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        result['results']['user'] = dict(result['results']['user'])
        result['results']['parent'] = dict(result['results']['parent'])
        self.assertEqual(result, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
