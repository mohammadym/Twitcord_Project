from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import FollowRequest, UserFollowing, TwitcordUser


class FollowingsTest(APITestCase):
    """
    Ensure we can get list of followings.
    Ensure we can unfollow a user.
    """

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.following_user_1 = twitcord_user.objects.create(username='test1', email='following1@gmail.com',
                                                             password='following1pass')
        self.following_user_2 = twitcord_user.objects.create(username='test2', email='following2@gmail.com',
                                                             password='following2pass')
        self.following_user_3 = twitcord_user.objects.create(username='test3', email='following3@gmail.com',
                                                             password='following3pass')
        self.following_user_4 = twitcord_user.objects.create(username='test4', email='following4@gmail.com',
                                                             password='following4pass')
        models.UserFollowing.objects.bulk_create([
            models.UserFollowing(user_id=self.user.id, following_user=self.following_user_1),
            models.UserFollowing(user_id=self.user.id, following_user=self.following_user_2),
            models.UserFollowing(user_id=self.user.id, following_user=self.following_user_3),
            models.UserFollowing(user_id=self.user.id, following_user=self.following_user_4)
        ])

    def test_list_of_followings(self):
        url = "/followings/list/{}/".format(self.user.id)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 4)

    def test_delete_followings_user(self):
        url = "/followings/{}/".format(self.following_user_1.id)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            models.UserFollowing.objects.filter(user_id=self.user.id, following_user=self.following_user_1))


class FollowRequestTest(APITestCase):
    """
    Ensure we can create new follow request with appropriate response.
    Ensure we can delete a follow request by user
    """

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.private_user_1 = twitcord_user.objects.create(username='test1', email='private_user1@gmail.com',
                                                           password='private_user1pass', is_public=False)
        self.public_user_1 = twitcord_user.objects.create(username='test2', email='public_user1@gmail.com',
                                                          password='public_user1pass', is_public=True)
        self.private_user_2 = twitcord_user.objects.create(username='test3', email='private_user2@gmail.com',
                                                           password='private_user2pass', is_public=False)
        self.following_request_1 = models.FollowRequest.objects.create(request_from=self.user,
                                                                       request_to=self.private_user_2)

    def test_follow_requests(self):
        url = "/followings/requests/"
        response = self.client.post(url, {"request_to": self.public_user_1.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], "following")

        response = self.client.post(url, {"request_to": self.private_user_1.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], "pending")

    def test_delete_follow_request(self):
        url = "/followings/requests/{}/".format(self.private_user_2.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(models.FollowRequest.objects.filter(id=self.following_request_1.id).exists())


class FollowersTest(APITestCase):
    """
    Ensure we can get list of followers
    """

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='test_pass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.follower_user_1 = twitcord_user.objects.create(username='test1', email='follower1@gmail.com',
                                                            password='follower1pass')
        self.follower_user_2 = twitcord_user.objects.create(username='test2', email='follower2@gmail.com',
                                                            password='follower2pass')
        models.UserFollowing.objects.bulk_create([
            models.UserFollowing(user_id=self.follower_user_1.id, following_user=self.user),
            models.UserFollowing(user_id=self.follower_user_2.id, following_user=self.user)
        ])

    def test_list_of_followers(self):
        url = "/followers/list/{}/".format(self.user.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)


class FollowersRequestTest(APITestCase):
    """
    Ensure we can get list of followers requests.
    Ensure we can answer followers requests.
    """

    def setUp(self):
        twitcord_user = get_user_model()
        self.user = twitcord_user.objects.create(username='test', email='test@gmail.com', password='test_pass',
                                                 is_public=False)
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.follower_user_1 = twitcord_user.objects.create(username='test1', email='follower1@gmail.com',
                                                            password='follower1pass')
        self.follower_user_2 = twitcord_user.objects.create(username='test2', email='follower2@gmail.com',
                                                            password='follower2pass')
        self.follow_requests = models.FollowRequest.objects.bulk_create([
            models.FollowRequest(request_from=self.follower_user_1, request_to=self.user),
            models.FollowRequest(request_from=self.follower_user_2, request_to=self.user)
        ])

    def test_followers_requests(self):
        url = "/followers/requests/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_answer_followers_request(self):
        accept_url = "/followers/requests/{}/?action=accept".format(self.follow_requests[0].id)
        reject_url = "/followers/requests/{}/?action=reject".format(self.follow_requests[1].id)

        response = self.client.patch(accept_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            models.UserFollowing.objects.filter(user_id=self.follower_user_1, following_user=self.user).exists())
        self.assertFalse(models.FollowRequest.objects.filter(id=self.follow_requests[0].id).exists())

        response = self.client.patch(reject_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            models.UserFollowing.objects.filter(user_id=self.follower_user_2, following_user=self.user).exists())
        self.assertFalse(models.FollowRequest.objects.filter(id=self.follow_requests[1].id).exists())
