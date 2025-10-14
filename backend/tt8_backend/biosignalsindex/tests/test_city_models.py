from django.test import TestCase
from django.db import IntegrityError
from ..models import City, ThematicUnit, Axis, SociodramaSession

class CityModelTests(TestCase):
    def setUp(self):
        self.city = City.objects.create(name="Test City")
        self.thematic = ThematicUnit.objects.create(
            name="Environment",
            city=self.city
        )

    def test_city_creation(self):
        self.assertEqual(self.city.name, "Test City")
        
    def test_unique_city_name(self):
        with self.assertRaises(IntegrityError):
            City.objects.create(name="Test City")

    def test_city_thematic_relationship(self):
        self.assertEqual(self.city.thematics.count(), 1)
        self.assertEqual(self.thematic.city, self.city)

    def test_cascade_delete(self):
        # Create related objects
        axis = Axis.objects.create(
            thematic=self.thematic,
            city=self.city,
            axis_id_in_thematic=1,
            title="Test Axis",
            color="#000000"
        )
        session = SociodramaSession.objects.create(
            thematic=self.thematic,
            city=self.city,
            session_id_in_thematic=1
        )

        # Test cascade delete
        self.city.delete()
        self.assertEqual(ThematicUnit.objects.count(), 0)
        self.assertEqual(Axis.objects.count(), 0)
        self.assertEqual(SociodramaSession.objects.count(), 0)