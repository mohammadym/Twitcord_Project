import json
import datetime
from datetime import datetime
from email import header
import base64
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .. import serializers
from .. import models
from django.test import Client

from django.utils import timezone
from rest_framework import serializers


class SearchUserTest(APITestCase):

    def test_search_users(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(email='mmd@gmail.com', username='test', password='test_pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        url = '/search/user/?query=t'
        response = self.client.get(url, content_type='application/json', accept='application/json')
        self.maxDiff = None
        data = {
            "count": 1,
            "next": None,
            "previous": None,
            "results": {
                "id": self.user.id,
                "username": "test",
                "first_name": None,
                "last_name": None,
                "is_public": True,
                "profile_img": None,
                "email": "mmd@gmail.com",
                "bio": None,
                "status": "not following"
            }
        }
        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        self.assertEqual(data, result)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SeachTweetTest(APITestCase):

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(email='test@gmail.com', username='test', password='test_pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.tweets = models.Tweet.objects.bulk_create([
            models.Tweet(content='Hi from there', user=self.user),
            models.Tweet(content='Goodbye', user=self.user)
        ])

    def test_search_tweet(self):
        url = '/search/tweet/?page=1&query=t'
        response = self.client.get(url, content_type='application/json')
        self.maxDiff = None
        data = {
            "count": 1,
            "next": None,
            "previous": None,
            "results":
                {
                    "id": self.tweets[0].id,
                    "user": {
                        'email': 'test@gmail.com',
                        'username': 'test',
                        'is_active': True,
                        'date_joined': serializers.DateTimeField().to_representation(self.user.date_joined),
                        'first_name': None,
                        'last_name': None,
                        'birth_date': None,
                        'bio': None,
                        'website': None,
                        'is_public': True,
                        'has_profile_img': False,
                        'profile_img': None,
                        'profile_img_upload_details': {
                            'bucket_name': 'media',
                            'object_name': 'profile_images/profile_img_36.jpg'
                        },
                        'has_header_img': False,
                        'header_img': None,
                        'header_img_upload_details': {
                            'bucket_name': 'media',
                            'object_name': 'profile_header_images/profile_header_img_36.jpg'
                        },
                        'id': 36,
                        'followings_count': 0,
                        'followers_count': 0,
                        'status': 'self',
                        'following_status': 'self'
                    },
                    "is_reply": False,
                    "content": "Hi from there",
                    "create_date": response.data['results'][0]['create_date'],
                    "parent": None,
                    "retweet_from": None,
                    "has_media": False,
                    "tweet_media": None,
                    'is_retweeted': False,
                    "is_liked": False,
                    'like_count': 0,
                    'reply_count': 0,
                    'retweet_count': 0
                }
        }
        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        result['results']['user'] = dict(result['results']['user'])
        self.assertEqual(result, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
