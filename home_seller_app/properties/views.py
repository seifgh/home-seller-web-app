from home_seller_app.models import *

from django.views.generic import View
from django.shortcuts import render



class PropertiesPageView(View):

    def get(self, request, property_id=None):
        return render(request, 'properties-react-page.html')
