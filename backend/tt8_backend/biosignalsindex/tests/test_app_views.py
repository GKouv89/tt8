from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import City, ThematicUnit, Axis, Scene, SociodramaSession, Participant, File

class ThematicViewsTests(APITestCase):
    """Tests for the ThematicScenes view, that retrieves all axes of a thematic including their scene count."""

    def setUp(self):
        """Creates test data for thematic, axes and scenes."""
        """One session with 3 scenes. The first two are shared between the first two axes (but ordered differently)"""
        """The third one is in its own axis"""
        self.city = City.objects.create(name="TestCity")
        self.thematic = ThematicUnit.objects.create(
            name="Environment",
            city=self.city
        )
        self.axis1 = Axis.objects.create(
            thematic=self.thematic,
            city=self.city,
            axis_id_in_thematic=1,
            title="Test Axis",
            color="#FF0000"
        )
        self.axis2 = Axis.objects.create(
            thematic=self.thematic,
            city=self.city,
            axis_id_in_thematic=2,
            title="Another Axis",
            color="#00FF00"
        )   
        self.axis3 = Axis.objects.create(
            thematic=self.thematic,    
            city=self.city,
            axis_id_in_thematic=3,
            title="Third Axis",
            color="#0000FF"
        )

        self.session = SociodramaSession.objects.create(
            city=self.city,
            thematic=self.thematic,
            session_id_in_thematic=1,
        )

        # Create Scene 1 - first in axis1, second in axis2
        self.scene1 = Scene.objects.create(
            session=self.session,
            scene_id_in_session=1,
        )
        # Add to axis1 as first scene
        self.scene1.axis.add(
            self.axis1,
            through_defaults={'scene_id_in_axis': 1}
        )
        # Add to axis2 as second scene
        self.scene1.axis.add(
            self.axis2,
            through_defaults={'scene_id_in_axis': 2}
        )

        # Create Scene 2 - second in axis1, first in axis2
        self.scene2 = Scene.objects.create(
            session=self.session,
            scene_id_in_session=2,
        )
        # Add to axis1 as second scene
        self.scene2.axis.add(
            self.axis1,
            through_defaults={'scene_id_in_axis': 2}
        )
        # Add to axis2 as first scene
        self.scene2.axis.add(
            self.axis2,
            through_defaults={'scene_id_in_axis': 1}
        )

        # Create Scene 3 - only in axis3
        self.scene3 = Scene.objects.create(
            session=self.session,
            scene_id_in_session=3,
        )
        self.scene3.axis.add(self.axis3)  # scene_id_in_axis=1

        self.scene3.axis.add(self.axis3, through_defaults={'scene_id_in_axis': 1})

        # Creating data for participant biometrics
        self.participant = Participant.objects.create(
            sensor_id_in_session=1,
            session=self.session
        )

        self.file = File.objects.create(
            participant=self.participant,
            scene=self.scene1,
            path='/path/to/biometric/file'
        )


    def test_thematic_scenes(self):
        """Tests retrieval of axes for a specific thematic."""
        url = reverse('ThematicScenes', kwargs={
            'city': self.city.name,
            'thematicName': self.thematic.name
        })
        print(f"Testing URL: {url}")
        response = self.client.get(url)
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        # Test axis titles
        self.assertEqual(response.data[0]['title'], "Test Axis")
        self.assertEqual(response.data[1]['title'], "Another Axis")
        self.assertEqual(response.data[2]['title'], "Third Axis")

        # Test scene counts
        self.assertEqual(response.data[0]['scene_count'], 2)  # axis1 has 2 scenes
        self.assertEqual(response.data[1]['scene_count'], 2)  # axis2 has 2 scenes
        self.assertEqual(response.data[2]['scene_count'], 1)  # axis3 has 1 scene

        # Test shared scenes
        self.assertEqual(len(response.data[0]['sharedScenes']), 2)  # axis1 shares 2 scenes
        self.assertEqual(len(response.data[1]['sharedScenes']), 2)  # axis2 shares 2 scenes
        self.assertEqual(len(response.data[2]['sharedScenes']), 0)  # axis3 has no shared scenes

        # Test shared scene order in different axes
        self.assertEqual(response.data[0]['sharedScenes'][0]['order'], 1)
        self.assertEqual(response.data[0]['sharedScenes'][1]['order'], 2)
        self.assertEqual(response.data[1]['sharedScenes'][0]['order'], 1)
        self.assertEqual(response.data[1]['sharedScenes'][1]['order'], 2)


    def test_participant_biometrics(self):
        """Tests retrieval of biometrics for a specific participant in a scene."""
        url = reverse('ParticipantBiometrics', kwargs={
            'city': self.city.name,
            'thematicName': self.thematic.name,
            'axis_id': self.axis1.axis_id_in_thematic,
            'scene_in_axis': 1,
            'participant_id': 1
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Further assertions can be added here based on expected biometrics data
