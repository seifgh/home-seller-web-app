from home_seller_app.models import Agent
from django.views.generic import View
from django.shortcuts import render



class HomePageView(View):

    def get(self, request):
        agents = Agent.objects.all().order_by('?')[:12]
        return render(request, 'home-webpack-page.html', context={'agents': agents})
