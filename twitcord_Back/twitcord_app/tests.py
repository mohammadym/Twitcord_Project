import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


class RegistrationTestCase(APITestCase):

    def test_registration(self):
        data = {"username":"testcase", "email":"test@test.app", "password1":"strong_pass", "password2": "strong_pass"}
        response = self.client.post("/rest-auth/registration/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    

