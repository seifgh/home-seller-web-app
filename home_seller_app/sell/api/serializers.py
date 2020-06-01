from home_seller_app.models import *


from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, Field ,ReadOnlyField, SerializerMethodField



class CountrySerializer(ModelSerializer):

	value = ReadOnlyField(source="name")

	class Meta:
		model = Country
		fields = ('value', 'currency', 'id')

class StateSerializer(ModelSerializer):

	value = ReadOnlyField(source="name")

	class Meta:
		model = State
		fields = ('value', 'id')

class CitySerializer(ModelSerializer):

	value = ReadOnlyField(source="name")

	class Meta:
		model = City
		fields = ('value', 'id')

class StreetSerializer(ModelSerializer):

	class Meta:
		model = Street
		fields = ('name', 'city')

class LocationSerializer(ModelSerializer):

	class Meta:
		model = Location
		fields = ('name', 'street')
		extra_kwargs = {
        	'street': {'allow_null': True, 'required': False},
		}

class ImageSerializer(ModelSerializer):

	class Meta:
		model = Image
		fields = ('image',)


class OwnerSerializer(ModelSerializer):

	class Meta:
		model = Owner
		fields = '__all__'

class PropertySerializer(ModelSerializer):

	class Meta:
		model = Property
		fields = (
			'name',
			'description',
			'location',
			'main_image',
			'images',
			'build_year',
			'price',
			'property_type',
			'is_furnished',
			'has_swimming_pool',
			'has_heating_and_colling',
			'balconies_number',
			'bedrooms_number',
			'bathrooms_number',
			'parking_spaces_number',
			'garages_number',
			'floor_space',
			'owner'
		)
		extra_kwargs = {
        	'location': {'allow_null': True, 'required': False},
        	'main_image': {'allow_null': True, 'required': False},
        	'images': {'allow_null': True, 'required': False},
        	'owner': {'allow_null': True, 'required': False},

		}

class PropertySerializer2(ModelSerializer):
	location = LocationSerializer()
	main_image = LocationSerializer()
	images = LocationSerializer(many=True)

	class Meta:
		model = Property
		fields = (
			'name',
			'description',
			'location',
			'main_image',
			'images',
			'build_year',
			'price',
			'property_type',
			'is_furnished',
			'has_swimming_pool',
			'has_heating_and_colling',
			'balconies_number',
			'bedrooms_number',
			'bathrooms_number',
			'parking_spaces_number',
			'garages_number',
			'floor_space',
			'owner'
		)


	def create(self, validated_data):
		print(validated_data.pop('location'))
		print(validated_data.pop('main_image'))
