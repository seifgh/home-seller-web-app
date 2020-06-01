from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.conf import settings
from django.utils import timezone


from home_seller_app.models import UserVerification, UserResetVerification


class AccountPageView(View):
    def get(self, request):
        return render(request, template_name="user-account-react-page.html")

class UserPageView(View):
    def get(self, request):
        return render(request, template_name="user-auth-react-page.html")

class ResetUserBykeyView(View):
    # redirect user to password update view
    def get(self, request, key):
        # check key
        user_reset_verification = get_object_or_404(
            UserResetVerification,
            key=key,
            user__is_active=True,
            creation_date__gte=timezone.now() - settings.RESET_KEY_EXPIRATION_TIME_DELTA
        )
        return render(request, template_name="user/index.html")

class ActivateUserByKeyView(View):
    # activate user from email link
    def get(self, request, key):
        user_verification = get_object_or_404(UserVerification, key=key, user__is_active=False);
        user_verification.activate_user()
        user_verification.delete()
        return HttpResponseRedirect("{}?from=activate".format(reverse('user-login')))
