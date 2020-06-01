# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery.decorators import task
from home_seller.celery import app
from home_seller_app.property_suggestions.property_suggestions import ModelSuggestions
from home_seller_app.models import Property, Suggestions

from django.core.mail import send_mail



# this task will run one time per day
@app.task(name="update-properties-suggestions")
def updateSuggestions():
    qs = Property.objects.filter(status='fs')
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
    ms = ModelSuggestions(query_set=qs, features=features)

    # update properties suggestions
    for property in qs:
        suggestions = ms.getTopSuggestions(top=12, pk=property.pk)
        property_suggestion = Suggestions.objects.get(property__pk = property.pk)
        property_suggestion.suggestions.set([ sug.pk for sug in suggestions ])

@app.task(name="send-mail")
def sendMail(to, subject, content):
    recipient_list = to if type(to) is list else [to]
    send_mail(
        subject=subject,
        recipient_list=recipient_list,
        html_message=content,
        message=None,
        from_email= "mail@whouses.com",
        fail_silently=False
    )
