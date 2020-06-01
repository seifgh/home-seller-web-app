from django.http import Http404
from django.utils import timezone
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from django.conf import settings

# from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .serializers import *
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.utils import timezone

import datetime
from utils.utils import dictHasExact, dictHas, validatePassword, UserActivationMailContent, UserResetMailContent

from home_seller_app.models import User, UserVerification
from home_seller_app.tasks import sendMail
from home_seller_app.permissions import IsClientUser
# consts


class UserView(APIView):
    permission_classes = [IsClientUser,]
    # Authenticated user data
    def get(self, request):
        user = request.user
        # update token if expired
        token = user.auth_token
        if (timezone.now() - token.created >= settings.JWT_EXPIRATION_TIME_DELTA):
            token.delete()
            token = Token.objects.create(user=user)
        response = {
            'id': user.id,
            'full_name': user.full_name,
            'token_key': token.key,
            'email': user.email,
            'joined': user.joined
        }
        return Response(data=response, status=status.HTTP_200_OK)

class SignInUserView(APIView):
    # User authentication
    def post(self, request):
        # check data
        if dictHasExact(request.POST, ('email', 'password') ):
            # get data
            email, password = request.POST.get('email'), request.POST.get('password')

            # get user or 400 with errors
            try:
                user = User.objects.get(email=email.strip())
                # if user not active return 400 with errors
                if not user.is_active:
                    response={
                        'errors': {
                            'email':'User with this email is not active. Please, verify your account first.'
                        }
                    }
                    return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                response={
                    'errors': {
                        'email':'User with this email does not exist.'
                    }
                }
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            # check user password
            if user.check_password(password):
                # return user token
                token, created = Token.objects.get_or_create(user=user)
                response = {
                    'token': token.key
                }
                return Response(data=response, status=status.HTTP_200_OK)
            else:
                response={
                    'errors': {
                        'password':'incorrect password.'
                    }
                }
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        # Bad data
        return Response(status=status.HTTP_404_NOT_FOUND)

class CreateUserView(APIView):
    # Create new user
    def post(self, request):
        # check data
        if dictHasExact(request.POST, ('full_name', 'email', 'password')) and validatePassword(request.POST.get('password')) :
            full_name, email, password = request.POST.get('full_name'), request.POST.get('email'), request.POST.get('password')
            user = UserSerializer(data={
                'full_name': full_name,
                'email': email,
                'password': make_password(password)
            })
            if ( user.is_valid() ):
                # save user
                user = user.save()
                # create user verification key
                user_verification = UserVerification.objects.create(user=user)
                # send activation link to user email
                sendMail.delay(
                    to=user.email,
                    subject="ws-houses account activation",
                    content=UserActivationMailContent(
                        full_name=user.full_name,
                        key=user_verification.key
                    )
                )
                return Response(status=status.HTTP_201_CREATED)
            return Response(data={'errors': user.errors}, status=status.HTTP_400_BAD_REQUEST)
        # Bad data
        return Response(status=status.HTTP_404_NOT_FOUND)

class ResetUserView(APIView):
    # Reset user password by email
    def post(self, request):
        # check data
        if dictHasExact(request.POST, ('email',) ):
            # get data
            email = request.POST.get('email')
            # get user or 400 with errors
            try:
                user = User.objects.get(email=email.strip())
                # if user not active raise 400 with errors
                if not user.is_active:
                    response={
                        'errors': {
                            'email':'User with this email is not active. Please, activate your account first.'
                        }
                    }
                    return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                response={
                    'errors': {
                        'email':'User with this email does not exist.'
                    }
                }
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            # check if user already has a password rest verfication
            user_reset = UserResetVerification.objects.filter(user=user)
            if user_reset.exists():
                user_reset = user_reset[0]
                # check if reset key expired or not
                if user_reset.creation_date >= timezone.now() - settings.RESET_KEY_EXPIRATION_TIME_DELTA:
                    response={
                        'errors': {
                            'email':'We have already sent you an email. Please, check your email or repeate later.'
                        }
                    }
                    return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
                else:
                    user_reset.delete()

            # create user reset verification key
            user_reset = UserResetVerification.objects.create(user=user)
            # send reset link to user email
            sendMail.delay(
                to=user.email,
                subject="ws-houses password reset",
                content=UserResetMailContent(
                    full_name=user.full_name,
                    key=user_reset.key
                )
            )
            return Response(status=status.HTTP_201_CREATED)
        # Bad data
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Update user password by key
    def put(self, request):
        # check data
        if dictHasExact(request.POST, ('password', 'key')) and validatePassword(request.POST.get('password')):
            password, key = request.POST['password'], request.POST['key']
            user_reset = get_object_or_404(
                UserResetVerification,
                key=key,
                user__is_active=True,
                creation_date__gte=timezone.now() - settings.RESET_KEY_EXPIRATION_TIME_DELTA
            )
            user_reset.reset_user(password=password)
            user_reset.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        # Bad data
        return Response(status=status.HTTP_404_NOT_FOUND)

class UserAccountSettingsView(APIView):
    permission_classes = [IsClientUser,]

    # delete account or sign out from other devices
    def post(self, request, action):
        data = request.POST
        if ( not request.user.check_password(data.get('password','')) ):
            return Response(data={'errors': {'password': 'Wrong password'}}, status=status.HTTP_400_BAD_REQUEST)

        if ( dictHasExact(data, ('password',) ) ):
            # Delete account
            if ( action == 'delete' ):
                request.user.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            # Sign out from all other devices
            elif ( action == 'sign_out' ):
                request.user.auth_token.delete()
                new_token = Token.objects.create(user=request.user).key
                return Response(data={'new_token': new_token}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    # update full_name or password
    def put(self, request):
        data = request.POST
        if ( not request.user.check_password(data.get('password','')) ):
            return Response(data={'errors': {'password': 'Wrong password'}}, status=status.HTTP_400_BAD_REQUEST)
        # full_name
        if ( dictHasExact(data, ('full_name', 'password') )):
            user = UserSerializer(request.user, data={'full_name': data['full_name']}, partial=True)
            if user.is_valid():
                 user.save()
                 return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(data={'errors': user.errors}, status=status.HTTP_400_BAD_REQUEST)

        # password

        elif ( dictHas(data, ('password', 'new_password') )  ):
            user = UserSerializer(request.user, data={'password': make_password(data['new_password'])}, partial=True)
            if user.is_valid():
                 user = user.save()
                 if ( data.get('sign_out') is not None ):
                     user.auth_token.delete()
                     new_token = Token.objects.create(user=user).key
                     return Response(data={'new_token': new_token}, status=status.HTTP_200_OK)
                 return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(data={'errors': user.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)
