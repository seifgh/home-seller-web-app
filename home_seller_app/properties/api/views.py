from django.shortcuts import get_object_or_404, get_list_or_404
from django.http import Http404
from django.db.models import Q
from django.contrib.postgres.search import SearchQuery
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from utils.utils import dictHasExact, dictHas, PaginatorByLatest, paginate
from .serializers import *

from functools import reduce
import operator, re, random, datetime
from home_seller_app.permissions import IsClientUser


# Constants
PAGINATE_BY = 3

SORTS_BY = ('pa', 'pd', 'bd', 'bt', 'nw', 'sf')

MIN_PRICE = 50000
MAX_PRICE = 2000000

MIN_SQUARE_FEET = 50
MAX_SQUARE_FEET = 1000000

PROPERTY_TYPES = ('hs', 'ma', 'mf', 'ap', 'll', 'th')

SHOULD_HAS_OPTIONS = ('sp', 'fu', 'hc', 'ga')

CLIENT_CODE_EXPIRATION_HOURS = datetime.timedelta(hours=1)
# End Constants

# utils

class StripWordSearchQuery(SearchQuery):

	""" change the function to 'to_tsquery'
		and clean the query value to be acceptable with the new function
	"""
	def as_sql(self, compiler, connection):

		query = re.sub(r'[!\'()|&]', ' ', self.value).strip()
		if query:
			query = re.sub(r'\s+', ' & ', query) + ':*'
		params = [query]
		function = 'to_tsquery'
		if self.config:
			config_sql, config_params = compiler.compile(self.config)
			template = '{}({}::regconfig, %s)'.format(function, config_sql)
			params = config_params + [self.value]
		else:
			template = '{}(%s)'.format(function)
		if self.invert:
			template = '!!({})'.format(template)
		return template, params

def getCleanSearchKey(sq):
	if ( sq ):
		return sq.replace(',', ' ').replace('-', ' ').replace('  ', ' ')
	return None

def getValidateSort(sort_by):
	if ( sort_by in SORTS_BY ):

		if sort_by == 'pa':
			return 'price'

		if sort_by == 'pd':
			return '-price'

		if sort_by == 'bd':
			return 'bedrooms_number'

		if sort_by == 'bt':
			return 'bathrooms_number'

		if sort_by == 'nw':
			return '-creation_date'

		if sort_by == 'sf':
			return 'floor_space'
	return 'price'

def getValidatePriceQuery(price):
	if (price and re.search("^(\d{5,7})-(\d{5,7})$", price)):
		price = [ int(x) for x in price.split('-') ]
		if (price[0] >= MIN_PRICE) and (price[1] <= MAX_PRICE):
			return Q(price__gte=price[0], price__lte=price[1])
	return Q()

def getValidateSquareFeetQuery(square_feet):
	if (square_feet and re.search("^(\d{2,7})-(\d{2,7})$", square_feet)):
		square_feet = [ int(x) for x in square_feet.split('-') ]
		if (square_feet[0] >= MIN_SQUARE_FEET ) and (square_feet[1] <= MAX_SQUARE_FEET):
			return Q(floor_space__gte=square_feet[0], floor_space__lte=square_feet[1])
	return Q()

def getValidateTypeQuery(property_type):
	if (property_type in PROPERTY_TYPES):
		return Q(property_type=property_type)
	return Q()

def getValidateRoomsQuery(rooms):
	if (rooms  and re.search("^(([1,2,3,4,5])|(any))-(([1,2,3,4,5])|(any))$", rooms)):
		rooms = rooms.split('-')


		bedrooms_min = int(rooms[0]) if ( rooms[0].isdigit() ) else None
		bathrooms_min = int(rooms[1]) if ( rooms[1].isdigit() ) else None
		if ( bedrooms_min == None and  bathrooms_min == None):
			return Q()
		if ( bedrooms_min != None and bathrooms_min != None ):
			return Q(bedrooms_number__gte=bedrooms_min, bathrooms_number__gte=bathrooms_min)
		if ( bedrooms_min != None ):
			return Q(bedrooms_number__gte=bedrooms_min)
		if ( bathrooms_min != None ):
			return Q(bathrooms_number__gte=bathrooms_min)

	return Q()

def getSearchQuery(sq):
	sq = getCleanSearchKey(sq)
	if ( sq ):
		return Q(location__street__search_vector=StripWordSearchQuery(sq))
	return Q()

def getValidateShouldHasQuery(should_has):
	if ( should_has ):
		should_has = should_has.split(',');
		queries=[]
		for x in should_has:
			if ( x == SHOULD_HAS_OPTIONS[0] ):
				queries.append(Q(has_swimming_pool=True))
			if ( x == SHOULD_HAS_OPTIONS[1] ):
				queries.append(Q(is_furnished=True))
			if ( x == SHOULD_HAS_OPTIONS[2] ):
				queries.append(Q(has_heating_and_colling=True))
			if ( x == SHOULD_HAS_OPTIONS[2] ):
				queries.append(Q(garages_number__gte=1))
		return queries
	return []
# End utils



class propertySearchOptionsView(APIView):

	def get(self, request):

		# get and clean <sq> param
		sq = getCleanSearchKey(request.GET.get('sq'))
		if ( sq ):
			 # filter locations by search query
			 query = StripWordSearchQuery(sq)
			 streets = Street.objects.filter(search_vector=query, is_verified=True)[0:10]
			 response = {
			 	'options': SearchStreetSerializer(streets, many=True).data
			 }
			 return Response(data=response, status=status.HTTP_200_OK)
		# if sq is not None
		return Response(status=status.HTTP_404_NOT_FOUND)

class PropertiesView(APIView):

	def get(self, request):

		# get page param
		page = request.GET.get('page')
		queries = []
		sort_by = getValidateSort(request.GET.get('sortBy'));
		queries = [
			getValidatePriceQuery(request.GET.get('price')),
			getValidateSquareFeetQuery(request.GET.get('squareFeet')),
			getValidateTypeQuery(request.GET.get('type')),
			getValidateRoomsQuery(request.GET.get('rooms')),
			getSearchQuery(request.GET.get('sq')),
			*getValidateShouldHasQuery(request.GET.get('shouldHas')),
			Q(status='fs', is_verified=True),
		]
		# filter properties
		properties = Property.objects.filter(reduce( operator.and_, queries )).order_by(sort_by)

		paginator = paginate(query_set=properties, paginate_by=PAGINATE_BY, page=page)

		response = {
			'data': PropertySerializer(paginator['data'], many=True).data,
			'has_next': paginator['has_next']
		}

		return Response(data=response, status=status.HTTP_200_OK)

class PropertyDetailsView(APIView):

	def get(self, request, id):

		# get the property		
		property = get_object_or_404(Property, id=id)
		# get the agent
		agent = get_list_or_404(InCharge, property=property)[0].agent
		# get the suggestions list
		suggestions = get_object_or_404(Suggestions, property=property)
		response = {
			'data': PropertyDetailsSerializer(property, many=False).data,
			'agent': AgentSerializer(agent, many=False).data,
			'suggestions': SuggestionsSerializer(suggestions, many=False).data['suggestions'],
			'is_bookmarked': False
		}

		if ( request.user.is_authenticated ):
			is_bookmarked =  request.user.user_bookmarks.filter(property=property).exists()
			response['is_bookmarked'] = is_bookmarked

		return Response(data=response, status=status.HTTP_200_OK)



class ClientContactView(APIView):
	# When client want to contact an agent for a house
	def post(self, request):
		data = request.POST
		if dictHas(data, ('full_name', 'email', 'phone','property_id', 'agent_id')):
			# check if contact already exists
			if Contact.objects.filter(
				client__email=data['email'], client__phone=data['phone'],
				property__id=data['property_id'], agent__id=data['agent_id']
			).exists():
				return Response(status=status.HTTP_201_CREATED)
			# create client
			client = ClientSerializer(data={
				'full_name': data['full_name'],
				'email': data['email'],
				'phone': data['phone'],
				'details': data['message'],
			})
			if ( client.is_valid() ):
				client = client.save()
				# create contact
				contact = ContactSerializer(data={
					'client': client.id,
					'property': data['property_id'],
					'agent': data['agent_id'],
					'status': 'uc',
				})
				if (contact.is_valid()):
					contact.save()
					# And here we done
					return Response(status=status.HTTP_201_CREATED)
				else:
					return Response(data={'errors': contact.errors}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return Response(data={'errors': client.errors}, status=status.HTTP_400_BAD_REQUEST)
		# Return form errors or invalid data errors
		return Response(status=status.HTTP_400_BAD_REQUEST)

class UserBookmarksView(APIView):
	permission_classes = [IsClientUser,]

	def get(self, request):
		# get latest_id param
		page = request.GET.get('page')
		# get user bookmarks
		bookmarks = request.user.user_bookmarks.all().order_by('-id')

		# paginate data
		paginator = paginate(query_set=bookmarks, paginate_by=PAGINATE_BY, page=page)

		response = {
			'data': UserBookmarkSerializer(paginator['data'], many=True).data,
			'bookmarks_count': bookmarks.count(),
			'has_next': paginator['has_next']
		}

		return Response(data=response, status=status.HTTP_200_OK)

	# add or remove a property to bookmarks list
	def put(self, request):
		data = request.POST
		if ( dictHasExact(data, ('property_id',)) and request.user.is_client ):
			# find property
			property = get_object_or_404(Property, id=data['property_id'] )
			bookmark = UserBookmark.objects.create(user=request.user, property=property)
			bookmark.save()
			return Response(status=status.HTTP_204_NO_CONTENT)
		# bad data
		return Response(status=status.HTTP_404_NOT_FOUND)
	def delete(self, request, property_id):
		# check data
		if (request.user.is_client):
			# find property
			try:
				bookmark = request.user.user_bookmarks.get(property__id=property_id)
			except UserBookmark.DoesNotExist:
				# bad data
				return Response(status=status.HTTP_404_NOT_FOUND)
			bookmark.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		# bad data
		return Response(status=status.HTTP_404_NOT_FOUND)
