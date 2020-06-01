from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import Http404, QueryDict
from django.db.models import Q
from django.contrib.postgres.search import SearchQuery
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from utils.utils import dictHasExact, dictHas, dictRemove, dictGet
from .serializers import *

from functools import reduce
import operator, re, random, datetime

# property address
class CountriesView(APIView):

	def get(self, request):
		countries = Country.objects.all()
		return Response(data={'countries': CountrySerializer(countries, many=True).data }, status=status.HTTP_200_OK)

class StatesView(APIView):

	def get(self, request, country_id):
		states = State.objects.filter(country__id=country_id)
		return Response(data={ 'states': StateSerializer(states, many=True).data }, status=status.HTTP_200_OK)

class CitiesView(APIView):

	def get(self, request, state_id):
		cities = City.objects.filter(state__id=state_id)
		return Response(data={ 'cities': CitySerializer(cities, many=True).data }, status=status.HTTP_200_OK)

class PostPropertyView(APIView):

	def post(self, request):
		data = request.data
		keys = ('city_id', 'street_name', 'location_name', 'property_type',
		 'name', 'description', 'build_year', 'bedrooms_number',
		 'bathrooms_number', 'garages_number', 'parking_spaces_number',
		 'floor_space', 'price', 'full_name', 'phone',
		 'email', 'message', 'main_image', 'details_images'
		)

		if dictHas(data, keys):
			# first step check all the data without saving
			property = PropertySerializer(data=dictRemove(data.dict(), ( 'main_image', 'details_images')))
			if  not property.is_valid():
				return Response(data={'errors': property.errors}, status=status.HTTP_400_BAD_REQUEST)

			owner = OwnerSerializer(data=dictGet(data.dict(), ('full_name', 'email', 'phone', 'message') ))
			if  not owner.is_valid():
				return Response(data={'errors': owner.errors}, status=status.HTTP_400_BAD_REQUEST)

			location = LocationSerializer(data={'name': data['location_name']})
			if  not location.is_valid():
				return Response(data={'errors': location.errors}, status=status.HTTP_400_BAD_REQUEST)

			main_image = ImageSerializer(data={'image': data['main_image']})
			if  not main_image.is_valid():
				return Response(data={'errors': main_image.errors}, status=status.HTTP_400_BAD_REQUEST)

			images = ImageSerializer(data=[ {'image': file} for file in data.getlist('details_images') ], many=True)
			if not images.is_valid():
				return Response(data={'errors': main_image.errors}, status=status.HTTP_400_BAD_REQUEST)


			streets = Street.objects.filter(name=data['street_name'], city__id=data['city_id'])
			street_exists = streets.exists()
			if not street_exists:
				street = StreetSerializer(data={'city': data['city_id'], 'name': data['street_name']})
				if not street.is_valid():
					return Response(data={'errors': street.errors}, status=status.HTTP_400_BAD_REQUEST)

			# saving data
			if street_exists:
				street = streets[0]
			else:
				street = street.save()
			owner = owner.save()
			location = location.save(street=street)

			main_image = main_image.save()
			images = images.save()

			property = property.save(
				location= location,
				main_image=main_image,
				images=images,
				owner=owner
			)
			return Response(status=status.HTTP_201_CREATED)

		# bad data
		return Response(status=status.HTTP_400_BAD_REQUEST)
