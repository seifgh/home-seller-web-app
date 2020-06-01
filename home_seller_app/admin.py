from django.contrib.admin import site, ModelAdmin, register
from home_seller_app.models import *
from home_seller_app.property_suggestions.property_suggestions import ModelSuggestions

# Register your models here.

site.register(User)
site.register(UserVerification)
site.register(UserResetVerification)
site.register(UserBookmark)
site.register(Image)
site.register(Country)
site.register(State)
site.register(City)
site.register(Location)
site.register(Owner)
# Street admin

def updateSearchVectors(modeladmin, request, queryset):
    ''' Update search vectors '''
    queryset = queryset.annotate(
        search_vector_fake=SearchVector(
            'name', 'city__name', 'city__postal_code',
            'city__state__name', 'city__state__country__name'
            )
    )
    for i in queryset:
        i.search_vector = i.search_vector_fake
        i.save()

@register(Street)
class StreetAdmin(ModelAdmin):
    actions=(updateSearchVectors,)

# end

def updatePropertiesSuggestions(modeladmin, request, queryset):
    features = [
        'pk',
        # location
        'location__street__latitude',
        'location__street__longitude',
        'location__street__name',
        'location__street__city__name',
        'location__street__city__state__name',
        'location__street__city__state__country__name',
        # specifications
        'price',
        'floor_space',
        'is_furnished',
        'has_swimming_pool',
        'has_heating_and_colling',
        'balconies_number',
        'bedrooms_number',
        'bathrooms_number',
        'parking_spaces_number',
        'garages_number'
    ]

    # calculate socores for each one
    ms = ModelSuggestions(query_set=queryset, features=features)

    # update properties suggestions
    for property in queryset:
        suggestions = ms.getTopSuggestions(top=12, pk=property.pk)
        property_suggestion = Suggestions.objects.get(property__pk = property.pk)
        property_suggestion.suggestions.set([ sug.pk for sug in suggestions ])


@register(Property)
class PropertyAdmin(ModelAdmin):
    actions=(updatePropertiesSuggestions,)

site.register(Agent)
site.register(InCharge)
site.register(Client)
site.register(Contact)
site.register(Suggestions)
