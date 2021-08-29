from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from .. import models

from ..models import TwitcordUser


class RegistrationTestCase(APITestCase):

    def test_registration(self):
        data = {
            "email": "test1@gmail.com",
            "first_name": "test",
            "last_name": "test",
            "username": "test",
            "password1": "88888888mostafa",
            "password2": "88888888mostafa",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = {
            "email": "test2@gmail.com",
            "first_name": "test",
            "last_name": "test",
            "password1": "88888888mostafa",
            "password2": "88888888mostafa",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "email": "test3@gmail.com",
            "first_name": "test",
            "last_name": "test",
            "username": "test",
            "password1": "88888888mostafa",
            "password2": "88888888mostafa",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "email": "test4@gmail.com",
            "username": "test5",
            "first_name": "test",
            "last_name": "test",
            "password1": "88888888mostafa1",
            "password2": "88888888mostafa",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "username": "test2",
            "first_name": "test",
            "last_name": "test",
            "password1": "88888888mostafa1",
            "password2": "88888888mostafa1",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "email": "test7@gmail.com",
            "first_name": "test",
            "last_name": "test",
            "username": "test3",
            "password1": "88888888mostafa1",
        }
        response = self.client.post("/rest-auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
