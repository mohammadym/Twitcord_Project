from __future__ import unicode_literals
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import TwitcordUserCreationForm, TwitcordUserChangeForm
from .models import *


class TwitcordUserAdmin(UserAdmin):
    add_form = TwitcordUserCreationForm
    form = TwitcordUserChangeForm
    model = TwitcordUser
    list_display = ('email', 'date_joined', 'profile_img', 'header_img')
    list_filter = ('email', 'date_joined')
    fieldsets = (
        (None, {'fields': ('email', 'password','first_name','last_name','bio','website','birth_date',
                           'has_profile_img', 'has_header_img')}),
        ('Permissions', {'fields': ('date_joined', 'is_public')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(TwitcordUser, TwitcordUserAdmin)


@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    model = Tweet
    list_display = ('id', 'content', 'create_date', 'tweet_media')


class UserFollowingAdmin(admin.ModelAdmin):
    model = UserFollowing
    list_display = ('user_id', 'following_user_id', 'created')


admin.site.register(UserFollowing, UserFollowingAdmin)


class FollowRequestAdmin(admin.ModelAdmin):
    model = FollowRequest
    list_display = ('request_from', 'request_to', 'date')


admin.site.register(FollowRequest, FollowRequestAdmin)


class LikeAdmin(admin.ModelAdmin):
    model = Like
    list_display = ('user', 'tweet', 'date')


admin.site.register(Like, LikeAdmin)


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'id')


@admin.register(RoomMessage)
class RoomMessageAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'sender', 'room', 'content')

