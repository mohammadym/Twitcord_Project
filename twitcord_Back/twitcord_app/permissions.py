from rest_framework import permissions
from . import models
from django.shortcuts import get_object_or_404


class UserIsOwnerOrReadonly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.following_user.id == request.user.id


class DeleteFollowRequestPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.request_from == request.user


class AnswerFollowRequestPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.request_to == request.user


class PrivateAccountTweetPermission(permissions.BasePermission):
    message = "You can't access the private account you are not following."

    def has_permission(self, request, view):
        tweet_id = view.kwargs.get('id')
        user = request.user
        tweet = get_object_or_404(models.Tweet, id=tweet_id)

        if tweet.user.is_public:
            return True

        if tweet.user == user:
            return True

        if models.UserFollowing.objects.filter(user=user, following_user=tweet.user).exists():
            return True

        return False


class PrivateAccountUserPermission(permissions.BasePermission):
    message = "You can't access the private account you are not following."

    def has_permission(self, request, view):
        user = request.user
        following_user_id = view.kwargs['id']
        following_user = get_object_or_404(models.TwitcordUser, id=following_user_id)
        if following_user.is_public:
            return True
        if user == following_user:
            return True
        return models.UserFollowing.objects.filter(user=user.id, following_user=following_user_id).exists()


class UsersTweetsPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            user_request_from = request.user
            user_request_to = get_object_or_404(models.TwitcordUser, id=view.kwargs.get('id'))
            if request.user.id == view.kwargs['id']:
                return True
            # public users
            if user_request_to.is_public:
                return True
            # following users
            elif models.UserFollowing.objects.filter(user_id=user_request_from.id, following_user_id=user_request_to)\
                                             .exists():
                return True
            # other private users
            else:
                return False
        elif request.method == 'POST':
            return request.user.id == view.kwargs['id']


class IsMemberOfRoom(permissions.BasePermission):
    message = "You can't access to messages of room that you aren't member of that"

    def has_permission(self, request, view):
        user = request.user
        room_id = view.kwargs['room_id']
        room = get_object_or_404(models.Room, id=room_id)
        if user in room.users.all() or user == room.owner:
            return True
        else:
            return False

class DestroyTweetPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        tweet_id = view.kwargs['id']
        tweet = get_object_or_404(models.Tweet, id=tweet_id)
        if request.user.id == tweet.user.id:
            return True
        else:
            return False
