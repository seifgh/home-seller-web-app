from home_seller_app.models import *


from django.views.generic import View
from django.urls import reverse
from django.shortcuts import render, HttpResponseRedirect


class SellPropertyPageView(View):

    def get(self, request, step):
        if step != 1:
            return HttpResponseRedirect(reverse('sell-property-steps', args=[1]))

        return render(request, template_name='sell-react-page.html')
