from django.urls import path, re_path

from . import views
from allauth.account.views import confirm_email


urlpatterns = [
    path('profile/<int:id>/header/', views.ProfileDetailsView.as_view()),
    path('users/<int:id>/tweets/', views.TweetsListCreateView.as_view()),
    re_path('accounts-rest/registration/account-confirm-email/(?P<key>.+)/', confirm_email,
            name='account_confirm_email'),
    path('followings/list/<int:id>/', views.ListOfFollowingsView.as_view()),
    path('followers/list/<int:id>/', views.ListOfFollowersView.as_view()),
    path('followings/<int:id>/', views.EditFollowingsView.as_view()),
    path('followings/requests/', views.FollowingRequestView.as_view()),
    path('followings/requests/<int:id>/', views.DeleteFollowRequestView.as_view()),
    path('followers/requests/', views.FollowersRequestsView.as_view()),
    path('followers/requests/<int:id>/', views.AnswerFollowRequestView.as_view()),
    path('follow/count/<int:id>/', views.FollowCountView.as_view()),
    path('search/user/', views.GlobalUserSearchList.as_view()),
    path('search/tweet/', views.GlobalTweetSearchList.as_view()),
    path('like/tweet/<int:id>/', views.LikeCreateView.as_view()),
    path('users/like/tweet/<int:id>/', views.UsersLikedTweetListView.as_view()),
    path('tweets/like/user/<int:id>/', views.TweetsLikedListView.as_view()),
    path('timeline/', views.TimeLineView.as_view()),
    path('tweets/<int:id>/retweet/', views.RetweetView.as_view()),
    path('create/rooms/', views.CreateRoomView.as_view()),
    path('user/<int:id>/rooms/', views.RoomView.as_view()),
    path('room/<int:id>/', views.RoomDataView.as_view()),
    path('reply/', views.ReplyTweetCreateView.as_view()),
    path('replys/<int:id>/', views.ReplysListView.as_view()),
    path('tweets/<int:id>/family/', views.ShowReplyFamilyView.as_view()),
    path('rooms/<int:room_id>/messages/', views.RoomMessagesListView.as_view()),
    path('tweets/<int:id>/', views.DeleteTweetView.as_view()),
]
