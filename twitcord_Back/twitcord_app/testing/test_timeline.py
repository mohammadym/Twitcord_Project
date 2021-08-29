from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import Tweet, Like
from rest_framework import serializers


class TimelineTest(APITestCase):
    def setUp(self):
        twitcord_user = get_user_model()
        self.user1 = twitcord_user.objects.create(username='test1', email='test1@gmail.com', password='testpass')
        self.user2 = twitcord_user.objects.create(username='test2', email='test2@gmail.com', password='testpass')
        self.user3 = twitcord_user.objects.create(username='test3', email='test3@gmail.com', password='testpass')
        self.user4 = twitcord_user.objects.create(username='test4', email='test4@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.tweet1 = models.Tweet.objects.create(user=self.user1, content='test1')
        self.tweet2 = models.Tweet.objects.create(user=self.user2, content='test2')
        self.tweet3 = models.Tweet.objects.create(user=self.user3, content='test3')
        self.tweet4 = models.Tweet.objects.create(user=self.user4, content='test4')

        models.UserFollowing.objects.bulk_create([
            models.UserFollowing(user_id=self.user1.id, following_user=self.user2),
            models.UserFollowing(user_id=self.user2.id, following_user=self.user3)
        ])

    def test_timeline(self):
        url = '/timeline/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.maxDiff = None
        data = {
            'count': 1,
            'next': None,
            'previous': None,
            'results':
                {
                    'id': 8,
                    'parent': None,
                    'retweet_from': None,
                    'is_reply': False,
                    'user': {
                        'email': 'test2@gmail.com',
                        'username': 'test2',
                        'is_active': True,
                        'date_joined': serializers.DateTimeField().to_representation(self.user2.date_joined),
                        'first_name': None,
                        'last_name': None,
                        'birth_date': None,
                        'bio': None,
                        'website': None,
                        'is_public': True,
                        'has_profile_img': False,
                        'profile_img': None,
                        'profile_img_upload_details': None,
                        'has_header_img': False,
                        'header_img': None,
                        'header_img_upload_details': None,
                        'id': 39,
                        'followings_count': 1,
                        'followers_count': 1,
                        'status': 'following',
                        'following_status': 'Unfamiliar_person'
                    },
                    'content': 'test2',
                    'create_date': serializers.DateTimeField().to_representation(response.data['results'][0]['create_date']),
                    'has_media': False,
                    'tweet_media': None,
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
        print(result)
        print(data)
        self.assertEqual(result, data)
