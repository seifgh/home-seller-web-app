from home_seller_app.models import *


from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, Field ,ReadOnlyField, SerializerMethodField


class ImageSerializer(ModelSerializer):

	src = ReadOnlyField()

	class Meta:

		model  = Image
		fields = ( 'id','src', )

class LocationSerializer(ModelSerializer):

	class Meta:
		model  = Location
		fields = (
			'id',
			'name',
			'latitude',
			'longitude',
			'full_city',
			'full_location'
		)

class SearchStreetSerializer(ModelSerializer):

	value = ReadOnlyField(source='full_street')
	class Meta:
		model = Street
		fields = (
			'value',
			'id'
		)

class PropertySerializer(ModelSerializer):

	location = ReadOnlyField(source='formated_location')
	property_type = ReadOnlyField(source='formated_property_type')
	image    = ImageSerializer(source='main_image')
	price = ReadOnlyField(source='formated_price')

	class Meta:
		model  = Property
		fields = (
			'id',
			'name',
			'image',
			'location',
			'bedrooms_number',
			'bathrooms_number',
			'is_furnished',
			'property_type',
			'price'
		)

class SuggestionsSerializer(ModelSerializer):

	suggestions = PropertySerializer(read_only=True, many=True)

	class Meta:
		model = Suggestions
		fields = ('suggestions',)

class UserBookmarkSerializer(ModelSerializer):

	property = PropertySerializer(read_only=True)

	class Meta:
		model = UserBookmark
		fields = (
			'id',
			'property',
			'creation_date'
		)

class PropertyDetailsSerializer(ModelSerializer):

	location =  LocationSerializer()
	images   =  ImageSerializer( read_only=True, many=True )
	property_type = ReadOnlyField(source='formated_property_type' )
	bookmarks_count = ReadOnlyField()
	price = ReadOnlyField(source='formated_price')

	class Meta:
		model = Property
		fields = (
			'id',
			'name',
			'description',
			'location',
			'build_year',
			'price',
			'images',
			'property_type',
			'is_furnished',
			'balconies_number',
			'bedrooms_number',
			'bathrooms_number',
			'has_heating_and_colling',
			'parking_spaces_number',
			'floor_space',
			'bookmarks_count'
		)

class AgentSerializer(ModelSerializer):

	image = ImageSerializer()
	full_name = ReadOnlyField()

	class Meta:
		model = Agent
		fields = (
			'id',
			'image',
			'email',
			'phone',
			'full_name'
		)

class ClientSerializer(ModelSerializer):

	class Meta:
		model  = Client
		fields = '__all__'

class ContactSerializer(ModelSerializer):

	class Meta:
		model = Contact
		fields = '__all__'
