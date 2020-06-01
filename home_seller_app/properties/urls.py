from django.urls import path, include
from .views import *


urlpatterns = [
    # React routers
    path('', PropertiesPageView.as_view()),
    path('property/<int:property_id>', PropertiesPageView.as_view()),
    path('bookmarks', PropertiesPageView.as_view()),
    path('search', PropertiesPageView.as_view()),

    # api
    path('api/', include('home_seller_app.properties.api.urls'))
]
