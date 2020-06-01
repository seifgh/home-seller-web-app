from django.db import IntegrityError
from django.db.models import Model, Value, F, CASCADE, CharField, EmailField, IntegerField, PositiveIntegerField, DecimalField, PositiveSmallIntegerField, TextField, ForeignKey, URLField, BooleanField, DateTimeField, DateField, OneToOneField, ManyToManyField, ImageField, FileField
from django.core.exceptions import ValidationError
from django.http import Http404
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.postgres.search import SearchVectorField, SearchVector
from django.contrib.postgres.indexes import GinIndex
from django.conf import settings
from django.utils import timezone

from utils.utils import generateKey, Validators

# Choices

USER_TYPES = (
	('ag','Agent'),
	('cl','Client'),
	('us', 'User')
)

PROPERTY_TYPES = (
	('hs','Houses'),
	('ma','Manufactured'),
	('mf','Multi-family'),
	('ap','Apartment'),
	('ll','Lots/Land'),
	('th','Townhomes')
)

PROPERTY_STATUS = (
	('uk', 'Under checking'),
	('fs', 'For sale'),
	('uc', 'Under contract'),
	('sa', 'saled')
)

CONTACT_STATUS = (
	('uc','Under consideration'),
	('a','Accepted'),
	('d','Denied')
)

MIN_PRICE = 50000
MAX_PRICE = 2000000

MIN_SQUARE_FEET = 100
MAX_SQUARE_FEET = 1000000

VERIFICATION_CODE_MIN = 1000
VERIFICATION_CODE_MAX = 9999

# Utils models

class Image(Model):

    url = URLField( blank = True )
    image = ImageField( upload_to = "images", blank = True )

    def clean(self):
        if ( not( self.url or self.image ) ):
            raise ValidationError("Two fields are emplty, at lease fill one !")
    @property
    def src(self):
    	if ( self.image ):
    		return '{}{}'.format(settings.MEDIA_FILES_HOST, self.image.url)
    	else:
    		return self.url

    def __str__(self):

        if ( self.image ):
            return self.image.url
        else:
            return self.url

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, is_active=False):

        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
			full_name=full_name,
			is_active=is_active
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password):

        user = self.create_user(
            email,
            password=password,
            full_name=full_name,
			is_active=True
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
	objects = UserManager()
	email = EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
	full_name = CharField(max_length=255)
	is_active = BooleanField(default=False)
	is_admin = BooleanField(default=False)

	type = CharField(max_length=2, choices=USER_TYPES, default='cl')

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['full_name']

	creation_date = DateTimeField(default=timezone.now)


	def __str__(self):

		# print(self == User.objects.get(id=self.id) )
		return self.email

	def save(self, *args, **kwargs):
		if settings.DEMO:
			self.is_active = True
		super(User, self).save(*args, **kwargs)


	def has_perm(self, perm, obj=None):
        # Simplest possible answer: Yes, always
		return True

	def has_module_perms(self, app_label):
        # Simplest possible answer: Yes, always
		return True

	@property
	def is_client(self):
		return self.type == 'cl'
	@property
	def is_staff(self):
		"Is the user a member of staff?"
		return self.is_admin
	@property
	def joined(self):
		return self.creation_date.strftime('%D')

class UserVerification(Model):
	user = OneToOneField(User, related_name="user_verification", on_delete=CASCADE)
	key = CharField(max_length=30, unique=True)

	creation_date = DateTimeField(default=timezone.now)
	def activate_user(self):
		self.user.is_active = True
		self.user.save()

	def save(self, *args, **kwargs):
		# create key
		self.key = generateKey()
		# prevent integrity error
		while( UserVerification.objects.filter(key=self.key).exists() ):
			self.key = generateKey()
		super(UserVerification, self).save(*args, **kwargs)

	def __str__(self):
		return self.key

class UserResetVerification(Model):
	user = OneToOneField(User, related_name="user_reset", on_delete=CASCADE)
	key = CharField(max_length=30, unique=True)

	creation_date = DateTimeField(default=timezone.now)
	def reset_user(self, password):
		self.user.set_password(password)
		self.user.save()

	def save(self, *args, **kwargs):
		# create key
		self.key = generateKey()
		# prevent integrity error
		while( UserResetVerification.objects.filter(key=self.key).exists() ):
			self.key = generateKey()
		super(UserResetVerification, self).save(*args, **kwargs)

	def __str__(self):
		return self.key

class Country(Model):
	code = CharField(max_length=2)
	name = CharField(max_length=100)
	currency = CharField(max_length=5)

	class Meta:
		verbose_name_plural = "Countries"

	def __str__(self):
		return '{} : {}'.format( self.code, self.name )

class State(Model):
	code 	= CharField( max_length = 2 )
	name 	= CharField( max_length = 100 )
	country = ForeignKey(Country,  on_delete = CASCADE)
	def __str__(self):
		return '{} : {}'.format( self.code, self.name )

class City(Model):
	name 	  = CharField( max_length = 100 )
	latitude  = DecimalField(max_digits = 15, decimal_places = 8)
	longitude = DecimalField(max_digits = 15, decimal_places = 8)
	state     = ForeignKey(State,  on_delete = CASCADE)
	postal_code = CharField( max_length=20 )

	class Meta:
		verbose_name_plural = "Cities"

	def getFullName(self):
		return '{}, {}, {}'.format(self.name, self.state.name, self.state.country.name)

	def __str__(self):
		return self.getFullName()

class Street(Model):

	name = CharField( max_length=50 )
	city = ForeignKey( City, on_delete=CASCADE )
	# geography postion
	latitude  = DecimalField( max_digits=15, decimal_places=8, null=True )
	longitude = DecimalField( max_digits=15, decimal_places=8, null=True )

	is_verified = BooleanField(default=False)

	search_vector = SearchVectorField( null=True )

	class Meta:
		indexes = [ GinIndex(fields=['search_vector']) ]
		unique_together = [ 'city', 'name' ]

	def setSearchVector(self):
		street = Street.objects.filter(id=self.id).annotate(
		 	search_vector_fake=SearchVector(
				'name', 'city__name', 'city__postal_code',
				'city__state__name', 'city__state__country__name'
				)
		)[0]
		self.search_vector = street.search_vector_fake
		self.save_base()

	def save(self, *args, **kwargs):
		super(Street, self).save(*args, **kwargs)
		self.setSearchVector()

	@property
	def full_street(self):
		return '{}, {}'.format(self.name, self.city.getFullName())

	def __str__(self):
		return self.full_street

class Location(Model):

	name = CharField( max_length=50, blank=True )
	street = ForeignKey( Street, on_delete=CASCADE )
	# geography postion
	latitude  = DecimalField( max_digits=15, decimal_places=8, null=True )
	longitude = DecimalField( max_digits=15, decimal_places=8, null=True )

	@property
	def full_street(self):
		return self.street.full_street

	@property
	def full_city(self):
		return self.street.city.getFullName()

	@property
	def full_location(self):
		if self.name:
			return '{}, {}'.format(self.name, self.street.full_street)
		else:
			return self.street.full_street

	def get_country_currency(self):
		return self.street.city.state.country.currency

	def __str__(self):
		return self.full_location

class Owner(Model):

	full_name = CharField( max_length=255 )
	email     = EmailField()
	phone     = CharField( max_length=30 )
	message   = TextField( max_length=10000, null=True , blank=True )
	creation_date = DateTimeField( default=timezone.now )

	def __str__(self):
		return  self.full_name

class Property(Model):

	name = CharField( max_length=50 )
	description = TextField( max_length=500, null=True, blank=True )
	location  = OneToOneField( Location, on_delete=CASCADE )
	main_image = OneToOneField( Image, on_delete=CASCADE )
	#Details
	build_year = PositiveIntegerField( default=0 )
	price = DecimalField( max_digits=10, decimal_places=2 )
	images = ManyToManyField(Image, related_name='property_image')
	property_type = CharField( max_length=5, choices=PROPERTY_TYPES )
	is_furnished = BooleanField(default=False)
	has_swimming_pool = BooleanField(default=False)
	has_heating_and_colling = BooleanField(default=False)
	balconies_number = PositiveIntegerField(default=0)
	bedrooms_number = PositiveIntegerField(default=0)
	bathrooms_number = PositiveIntegerField(default=0)
	parking_spaces_number = PositiveIntegerField(default=0)
	garages_number = PositiveIntegerField(default=0)
	floor_space = DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
	owner = OneToOneField(Owner, on_delete=CASCADE, null=True)

	status = CharField( max_length=2, choices=PROPERTY_STATUS, default='uk' )
	is_verified = BooleanField(default=False)
	creation_date = DateTimeField( default=timezone.now )

	class Meta:
		verbose_name_plural = "Properties"

	@property
	def formated_property_type(self):

		code = self.property_type
		for home_type in PROPERTY_TYPES:
			if ( home_type[0] == code ):
				return home_type[1]

	@property
	def formated_location(self):
		return self.location.full_city
	@property
	def formated_price(self):
		return '{} {}'.format(self.location.get_country_currency(), format(int(self.price), ','))

	@property
	def bookmarks_count(self):
		return UserBookmark.objects.filter(property=self).count()

	def clean(self):
		errors = {}
		name_error = Validators.maxMinLength(self.name, 50, 10)
		if name_error:
			errors['name'] = name_error

		description_error = Validators.maxMinLength(self.name, 500, 20)
		if description_error:
			errors['description'] = description_error

		price_error = Validators.maxMinNumber(self.price, MAX_PRICE, MIN_PRICE)
		if price_error:
			errors['price'] = price_error

		floor_space_error = Validators.maxMinNumber(self.floor_space, MAX_SQUARE_FEET, MIN_SQUARE_FEET)
		if floor_space_error:
			errors['floor_space'] = floor_space_error
		# may more errors like bathrooms ...
		if errors:
			raise ValidationError(errors)

	def __str__(self):
		return '{} - {}'.format( self.name, self.formated_location )

class Suggestions(Model):
	property = OneToOneField(Property, on_delete=CASCADE)
	suggestions = ManyToManyField(Property, related_name='property_suggestions', blank=True)

	class Meta:
		verbose_name_plural = "Properties suggestions"
	def __str__(self):
		return '{} suggestions'.format(self.property.name)

class Agent(Model):

	first_name = CharField( max_length = 50 )
	last_name  = CharField( max_length = 50 )
	image = OneToOneField( Image, on_delete=CASCADE )
	email      = EmailField()
	birth      = DateField()
	phone      = CharField( max_length = 30 )
	#location
	city       = ForeignKey( City, on_delete=CASCADE )
	address    = CharField( max_length = 100 )


	creation_date = DateTimeField( default=timezone.now )
	@property
	def full_name(self):
		return '{} {}'.format(self.first_name, self.last_name)

	@property
	def formated_location(self):
		return '{} - {}'.format(self.city.state.name, self.city.state.country.name)
	
	def __str__(self):
		return self.full_name

class InCharge(Model):

	''' The responsible on saling the house '''

	property = ForeignKey( Property, on_delete=CASCADE )
	agent    = ForeignKey( Agent, on_delete=CASCADE )

	date_from = DateField()
	date_to   = DateField()

	creation_date = DateTimeField( default=timezone.now )


	def clean(self):
		if ( self.date_from > self.date_to ):
			raise ValidationError({'date_to':"Date from should be less than date to"})

	def __str__(self):
		return '{} - {} - from  {} to {}'.format( self.agent.full_name, self.property.name, self.date_from, self.date_to )

class Client(Model):

	full_name = CharField( max_length=255 )
	email     = EmailField()
	phone     = CharField( max_length=30 )
	details   = TextField( max_length=10000, null=True , blank=True )
	creation_date = DateTimeField( default=timezone.now )

	def __str__(self):
		return  self.full_name

class Contact(Model):

	client = OneToOneField( Client, on_delete=CASCADE )
	agent  = ForeignKey( Agent, on_delete=CASCADE )
	property = ForeignKey( Property, on_delete=CASCADE )

	status  = CharField( max_length=2, choices=CONTACT_STATUS )

	creation_date = DateTimeField( default=timezone.now )

	class Meta:
		unique_together = ['property', 'client']

	def __str__(self):
		return '{} - {} - {}'.format(self.agent.full_name, self.client.full_name, self.property.name)

class UserBookmark(Model):
	user = ForeignKey(User, related_name="user_bookmarks", on_delete=CASCADE)
	property = ForeignKey(Property, on_delete=CASCADE)
	creation_date = DateTimeField(default=timezone.now)

	class Meta:
		verbose_name_plural = "Bookmarks"

	class Meta:
		unique_together = ['user', 'property']

	def __str__(self):
		return self.property.name
