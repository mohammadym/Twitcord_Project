from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .managers import TwitcordUserManager
from twitcord_Back.settings import minio_client
from django.db.models import Q


class TwitcordUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_public = models.BooleanField(default=True)
    username = models.TextField(max_length=15)
    is_admin = True
    first_name = models.CharField(null=True, max_length=50, blank=True)
    last_name = models.CharField(null=True, max_length=50, blank=True)
    bio = models.TextField(null=True, max_length=160, blank=True)
    birth_date = models.DateTimeField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)

    # Profile Image
    has_profile_img = models.BooleanField(default=False)
    PROFILE_IMG_DIRECTORY = f"profile_images"

    # Header Image
    has_header_img = models.BooleanField(default=False)
    HEADER_IMG_DIRECTORY = "profile_header_images"

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = TwitcordUserManager()

    def __str__(self):
        return self.email

    @property
    def get_profile_img_name(self):
        PROFILE_IMG_NAME = f"profile_img_{self.id}.jpg"
        return PROFILE_IMG_NAME

    @property
    def profile_img_upload_details(self):
        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.PROFILE_IMG_DIRECTORY
        name = self.get_profile_img_name

        image = {
            'bucket_name': bucket_name,
            'object_name': f"{directory}/{name}"
        }
        return image

    @property
    def profile_img(self):
        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.PROFILE_IMG_DIRECTORY
        if not self.has_profile_img:
            return None
        name = self.get_profile_img_name
        object_name = f"{directory}/{name}"

        url = minio_client.get_presigned_url("GET", bucket_name, object_name)
        return url

    @property
    def get_header_img_name(self):
        header_img_name = f"profile_header_img_{self.id}.jpg"
        return header_img_name

    @property
    def header_img_upload_details(self):
        image = {
            'bucket_name': settings.MEDIA_BUCKET_NAME,
            'object_name': f"{self.HEADER_IMG_DIRECTORY}/{self.get_header_img_name}"
        }
        return image

    @property
    def header_img(self):
        if not self.has_header_img:
            return None
        name = self.get_header_img_name
        object_name = f"{self.HEADER_IMG_DIRECTORY}/{name}"
        url = minio_client.get_presigned_url("GET", settings.MEDIA_BUCKET_NAME, object_name)
        return url

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    @is_staff.setter
    def is_staff(self, value):
        self._is_staff = value


class Tweet(models.Model):
    parent = models.ForeignKey("Tweet", related_name='reply_to', on_delete=models.CASCADE, default=None, null=True,
                               blank=True)
    retweet_from = models.ForeignKey("Tweet", related_name='retweet_of', on_delete=models.CASCADE, null=True,
                                     blank=True)
    is_reply = models.BooleanField(default=False)
    user = models.ForeignKey(TwitcordUser, on_delete=models.CASCADE)
    content = models.TextField(max_length=280, null=True)
    create_date = models.DateTimeField(default=timezone.now)

    # Media(photo) for tweet
    has_media = models.BooleanField(default=False)
    TWEET_MEDIA_DIRECTORY = f"tweets"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'retweet_from'], condition=Q(content__isnull=True),
                                    name='unique_retweet'),
            models.CheckConstraint(check=((Q(retweet_from__isnull=True) & Q(content__isnull=False)) |
                                          Q(retweet_from__isnull=False)), name='content_null',)
        ]

    def __str__(self):
        return f"{self.id}|{self.content}"

    @property
    def get_tweet_media_name(self):
        return f"tweet_media_{self.id}.jpg"

    @property
    def tweet_media_upload_details(self):
        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.TWEET_MEDIA_DIRECTORY
        name = self.get_tweet_media_name

        image = {
            'bucket_name': bucket_name,
            'object_name': f"{directory}/{name}"
        }
        return image

    @property
    def tweet_media(self):
        if not self.has_media:
            return None

        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.TWEET_MEDIA_DIRECTORY
        name = self.get_tweet_media_name
        object_name = f"{directory}/{name}"

        url = minio_client.get_presigned_url("GET", bucket_name, object_name)
        return url


class UserFollowing(models.Model):

    class FollowingType(models.TextChoices):
        FAMILY = 'Family', _('family')
        FRIEND = 'Friend', _('friend')
        CLOSE_FRIEND = 'Close_friend', _('close friend')
        UNFAMILIAR_PERSON = 'Unfamiliar_person', _('unfamiliar person')

    type = models.CharField(max_length=30, choices=FollowingType.choices, default=FollowingType.UNFAMILIAR_PERSON)
    user = models.ForeignKey("TwitcordUser", related_name="following", on_delete=models.CASCADE)
    following_user = models.ForeignKey("TwitcordUser", related_name="followers", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "following_user")
        ordering = ["-created"]


class FollowRequest(models.Model):
    request_from = models.ForeignKey(TwitcordUser, related_name="request_from", on_delete=models.CASCADE)
    request_to = models.ForeignKey(TwitcordUser, related_name="request_to", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("request_from", "request_to")
        ordering = ['-date']


class Like(models.Model):
    user = models.ForeignKey(TwitcordUser, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tweet")


class Room(models.Model):
    owner = models.ForeignKey(TwitcordUser, related_name="created_rooms", on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    users = models.ManyToManyField("TwitcordUser", related_name="rooms", blank=True)

    # room image
    has_image = models.BooleanField(default=False)
    ROOM_IMAGE_DIRECTORY = f"rooms"

    @property
    def get_room_img_name(self):
        return f"room_img_{self.id}.jpg"

    @property
    def room_img_upload_details(self):
        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.ROOM_IMAGE_DIRECTORY
        name = self.get_room_img_name

        image = {
            'bucket_name': bucket_name,
            'object_name': f"{directory}/{name}"
        }
        return image

    @property
    def room_img(self):
        if not self.has_image:
            return None

        bucket_name = settings.MEDIA_BUCKET_NAME
        directory = self.ROOM_IMAGE_DIRECTORY
        name = self.get_room_img_name
        object_name = f"{directory}/{name}"

        url = minio_client.get_presigned_url("GET", bucket_name, object_name)
        return url

    def __str__(self):
        return f"{self.title}"


class RoomMessage(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(TwitcordUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    content = models.TextField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.content}"
