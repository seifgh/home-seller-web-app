from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, Field ,ReadOnlyField, SerializerMethodField

from home_seller_app.models import User, UserResetVerification


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            'email',
            'full_name',
            'password'
        )
