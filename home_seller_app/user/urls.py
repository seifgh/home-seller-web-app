from django.urls import path, include
from .views import *


urlpatterns = [
    # React js pages

    # account
    path('account/edit', AccountPageView.as_view()),
    path('account/actions', AccountPageView.as_view()),
    path('account/password', AccountPageView.as_view()),

    # auth
    path('signin', UserPageView.as_view(), name='user-login'),
    path('reset', UserPageView.as_view(), name='user-reset'),
    path('reset/update/<key>', ResetUserBykeyView.as_view(), name='user-reset-update'),
    path('signup', UserPageView.as_view(), name='user-signup'),
    path('activate/<key>', ActivateUserByKeyView.as_view(), name='activate-user'),

    # api
    path('api/', include('home_seller_app.user.api.urls')),
]
