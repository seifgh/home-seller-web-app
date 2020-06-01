from django.urls import path
from .views import *


urlpatterns = [
   path('search/locations', propertySearchOptionsView.as_view(), name="search"),
   
   path('properties', PropertiesView.as_view(), name="properties"),
   path('property/<int:id>', PropertyDetailsView.as_view(), name="property"),

   path('contact/property', ClientContactView.as_view(), name="contact-agent"),
   path('bookmarks', UserBookmarksView.as_view(), name="bookmarks"),
   path('bookmarks/add', UserBookmarksView.as_view(), name="add-to-bookmarks"),
   path('bookmarks/remove/<int:property_id>', UserBookmarksView.as_view(), name="remove-from-bookmarks"),
]
