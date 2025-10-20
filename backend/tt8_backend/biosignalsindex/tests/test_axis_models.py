from django.test import TestCase
from ..models import City, ThematicUnit, Axis, SociodramaSession, Scene

class AxisTests(TestCase):
    def setUp(self):
        self.city = City.objects.create(name="TestCity")
        self.thematic = ThematicUnit.objects.create(
            name="Environment",
            city=self.city
        )
        self.axis = Axis.objects.create(
            thematic=self.thematic,
            city=self.city,
            axis_id_in_thematic=1,
            title="Test Axis",
            color="#FF0000"
        )

    def test_axis_natural_key(self):
        retrieved_axis = Axis.objects.get_by_natural_key("TestCity", "Environment", 1)
        self.assertEqual(retrieved_axis, self.axis)

    def test_axis_scene_count(self):
        session = SociodramaSession.objects.create(
            thematic=self.thematic,
            city=self.city,
            session_id_in_thematic=1
        )
        scene = Scene.objects.create(
            session=session,
            scene_id_in_session=1
        )
        scene.axis.add(self.axis)
        self.assertEqual(self.axis.scene_count, 1)

    def test_shared_scenes(self):
        # Test scenes shared between multiple axes
        axis2 = Axis.objects.create(
            thematic=self.thematic,
            city=self.city,
            axis_id_in_thematic=2,
            title="Test Axis 2",
            color="#00FF00"
        )
        session = SociodramaSession.objects.create(
            thematic=self.thematic,
            city=self.city,
            session_id_in_thematic=1
        )
        scene = Scene.objects.create(
            session=session,
            scene_id_in_session=1
        )
        scene.axis.add(self.axis, axis2)
        self.assertEqual(len(self.axis.sharedScenes), 1)