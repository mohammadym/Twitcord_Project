from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import TwitcordUser


class TwitcordUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = TwitcordUser
        fields = ('email',)


class TwitcordUserChangeForm(UserChangeForm):

    class Meta:
        model = TwitcordUser
        fields = ('email',)
