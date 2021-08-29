from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import Tweet, Like
from rest_framework import serializers


class LikeTest(APITestCase):

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.tweet = models.Tweet.objects.create(user=self.user, content='salam')

    def test_like(self):
        url = '/like/tweet/{}/'.format(self.tweet.id)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            "id": 1,
            "date": response.data['date'],
            "user": self.user.id,
            "tweet": 1
        }
        self.assertEqual(response.data, data)

        url = '/users/like/tweet/{}/'.format(self.tweet.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data['results']), 1)

        url = '/tweets/like/user/{}/'.format(self.user.id)
        response = self.client.get(url, content_type='application/json')
        self.maxDiff = None
        data = {
            "count": 1,
            "next": None,
            "previous": None,
            "results":
                {
                    "id": 1,
                    "tweet": {
                        "id": self.tweet.id,
                        "content": "salam",
                        "create_date": serializers.DateTimeField().to_representation(self.tweet.create_date),
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
                                'object_name': 'profile_images/profile_img_28.jpg'},
                            'has_header_img': False,
                            'header_img': None,
                            'header_img_upload_details': {
                                'bucket_name': 'media',
                                'object_name': 'profile_header_images/profile_header_img_28.jpg'},
                            'id': 28,
                            'followings_count': 0,
                            'followers_count': 0,
                            'status': 'self',
                            'following_status': 'self'
                        },
                        "tweet_media": None,
                        "has_media": False,
                        "is_retweeted": False,
                        "is_liked": True,
                        "like_count": 1,
                        "reply_count": 0,
                        "retweet_count": 0,
                        "username": "test",
                        "first_name": None,
                        "last_name": None,
                        "is_public": True
                    },
                    "date": response.data['results'][0]['date'],
                    "user": 28
                }
        }
        result = response.data
        result = dict(result)
        result['results'] = dict(result['results'][0])
        result['results']['tweet'] = dict(result['results']['tweet'])
        result['results']['tweet']['user'] = dict(result['results']['tweet']['user'])
        self.assertEqual(result, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = '/like/tweet/{}/'.format(self.tweet.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(models.Like.objects.filter(id=self.tweet.id).exists())
