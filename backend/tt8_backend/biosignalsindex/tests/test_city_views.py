from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import City, ThematicUnit

class CityViewsTests(APITestCase):
    def setUp(self):
        self.city1 = City.objects.create(
            name="City 1",
            description="Description of City 1"
        )
        self.city2 = City.objects.create(
            name="City 2",
            description="Description of City 2"
        )
        self.thematic1 = ThematicUnit.objects.create(
            name="Environment",
            city=self.city1
        )
        self.thematic2 = ThematicUnit.objects.create(
            name="Environment",
            city=self.city2
        )

    def test_list_cities(self):
        url = reverse('Cities')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], "City 1")
        self.assertEqual(response.data[0]['description'], "Description of City 1")

    def test_city_thematics(self):
        url = reverse('CityThematics', kwargs={'city': 'City 1'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Test new response structure
        self.assertIn('city', response.data)
        self.assertIn('thematics', response.data)
        
        # Test city data
        self.assertEqual(response.data['city']['name'], "City 1")
        self.assertEqual(response.data['city']['description'], "Description of City 1")
        
        # Test thematics data
        self.assertEqual(len(response.data['thematics']), 1)
        self.assertEqual(response.data['thematics'][0]['name'], "Environment")

    def test_nonexistent_city_thematics(self):
        url = reverse('CityThematics', kwargs={'city': 'NonexistentCity'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)