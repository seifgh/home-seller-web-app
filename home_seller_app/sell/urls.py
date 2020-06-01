from django.urls import path, include
from .views import *


urlpatterns = [
    # react paths
    path('property/<int:step>', SellPropertyPageView.as_view(), name="sell-property-steps"),

    # api
    path('api/', include('home_seller_app.sell.api.urls'))
]
