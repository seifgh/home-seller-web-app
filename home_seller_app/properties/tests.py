from django.test import TestCase
from django.test import Client
from django.urls import reverse

class PropertiesTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        # set api urls
        self.properties_url = reverse('properties')
        self.property_url = reverse('property', args=[1])
        self.contact_agent_url = reverse('contact-agent')
        self.bookmarks_urls = {
            'get': reverse('bookmarks'),
            'add': reverse('add-to-bookmarks'),
            'remove': reverse('remove-from-bookmarks')
        }
        self.search_url = reverse('search')

    def get_properties(self):
        # test success request
        response = self.client.get(self.properties_url)
        self.assertEquals(response.status, 200)
        
