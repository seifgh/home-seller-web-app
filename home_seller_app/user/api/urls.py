from django.urls import path
from .views import *


urlpatterns = [
    path('auth', UserView.as_view() ),
    path('auth/signin', SignInUserView.as_view() ),
    path('signup', CreateUserView.as_view() ),
    path('reset', ResetUserView.as_view()),
    path('settings', UserAccountSettingsView.as_view() ),
    path('settings/<action>', UserAccountSettingsView.as_view() ),
]
