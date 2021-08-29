from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import Tweet, Like
from rest_framework import serializers


class TweetTest(APITestCase):

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.tweet = models.Tweet.objects.create(user=self.user, content='salam')

        self.user1 = twitcord_user.objects.create(username='test1', email='test1@gmail.com', password='testpass')
        self.user2 = twitcord_user.objects.create(username='test2', email='test2@gmail.com', password='testpass')
        self.user3 = twitcord_user.objects.create(username='test3', email='test3@gmail.com', password='testpass')

    def test_tweet(self):
        url = '/users/{}/tweets/'.format(self.user.id)
        self.maxDiff = None
        data = {
            "content": "first tweet",
            "has_media": False
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        create_date = serializers.DateTimeField().to_representation(response.data['create_date'])

        response_data = {
            "id": 1,
            "content": "first tweet",
            "create_date": create_date,
            "user": {
                "email": "test@gmail.com",
                "username": "test",
                "is_active": True,
                "date_joined": response.data['user']['date_joined'],
                "first_name": None,
                "last_name": None,
                "birth_date": None,
                "bio": None,
                "website": None,
                "is_public": True,
                "has_profile_img": False,
                "profile_img": None,
                "profile_img_upload_details": {
                    "bucket_name": "media",
                    "object_name": "profile_images/profile_img_2.jpg"
                },
                "has_header_img": False,
                "header_img": None,
                "header_img_upload_details": {
                    "bucket_name": "media",
                    "object_name": "profile_header_images/profile_header_img_2.jpg"
                },
                "id": 31,
                "followings_count": 0,
                "followers_count": 0,
                "status": "self",
                "following_status": "self"
            },
            "tweet_media": None,
            "has_media": False,
            "tweet_media_upload_details": {
                "bucket_name": "media",
                "object_name": "tweets/tweet_media_118.jpg"
            },
            "is_retweeted": False,
            "is_liked": False,
            "like_count": 0,
            "reply_count": 0,
            "retweet_count": 0
        }

        time2 = response.data['user']['date_joined']
        self.assertEqual(response.data, response_data)

        self.assertEqual(len(models.Tweet.objects.filter(user__id=self.user.id)), 1)

        url = '/users/{}/tweets/'.format(self.user.id)
        response = self.client.get(url, content_type='application/json')
        data = {
            "id": 1,
            "content": "first tweet",
            "create_date": create_date,
            "user": {
                "email": "test@gmail.com",
                "username": "test",
                "is_active": True,
                "date_joined": time2,
                "first_name": None,
                "last_name": None,
                "birth_date": None,
                "bio": None,
                "website": None,
                "is_public": True,
                "has_profile_img": False,
                "profile_img": None,
                "profile_img_upload_details": {
                    "bucket_name": "media",
                    "object_name": "profile_images/profile_img_3.jpg"
                },
                "has_header_img": False,
                "header_img": None,
                "header_img_upload_details": {
                    "bucket_name": "media",
                    "object_name": "profile_header_images/profile_header_img_3.jpg"
                },
                "id": 31,
                "followings_count": 0,
                "followers_count": 0,
                "status": "self",
                "following_status": "self"
            },
            "tweet_media": None,
            "has_media": False,
            "is_retweeted": False,
            "is_liked": False,
            "like_count": 0,
            "reply_count": 0,
            "retweet_count": 0
        }

        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        result['results']['user'] = dict(result['results']['user'])
        self.assertEqual(result, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
