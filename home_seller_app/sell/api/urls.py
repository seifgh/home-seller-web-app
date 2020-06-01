from django.urls import path
from .views import *


urlpatterns = [
    path('countries', CountriesView.as_view()),
    path('states/<country_id>', StatesView.as_view()),
    path('cities/<state_id>', CitiesView.as_view()),
    path('post-property', PostPropertyView.as_view()),
]
