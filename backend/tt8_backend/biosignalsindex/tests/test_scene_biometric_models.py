from rest_framework.test import APITestCase
from django.urls import reverse
from ..models import (
    City, ThematicUnit, Axis, SociodramaSession, Scene, 
    Task, SceneInTaskMetadata, File, Participant, Biometric,
    BiometricMetadataForTask, BioPeakMetadata
)

class SceneBiometricsTests(APITestCase):
    def setUp(self):
        # Setup city, thematic, axis hierarchy
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
        self.session = SociodramaSession.objects.create(
            thematic=self.thematic,
            city=self.city,
            session_id_in_thematic=1
        )
        
        # Create task
        self.task = Task.objects.create(
            session=self.session,
            task_no_in_section=1,
            starting_time=0.0,
            ending_time=10.0
        )

        # Create scene with task metadata
        self.scene = Scene.objects.create(
            session=self.session,
            scene_id_in_session=1,
            is_superepisode=True,
            starting_time=2.0,
            ending_time=8.0
        )
        self.scene.axis.add(self.axis)
        
        # Create scene-task relationship
        self.scene_task_meta = SceneInTaskMetadata.objects.create(
            scene=self.scene,
            task=self.task,
            task_order=1,
            starting_row=20,
            ending_row=80
        )

        # Create participant and file
        self.participant = Participant.objects.create(
            session=self.session,
            sensor_id_in_session=1
        )
        self.file = File.objects.create(
            task=self.task,
            participant=self.participant,
            path="test/path.csv"
        )

        # Create biometric metadata
        self.biometric = Biometric.objects.create(
            name="Heart Rate",
            abbr="HR"
        )

        # Add biometric metadata for task
        self.bio_meta = BiometricMetadataForTask.objects.create(
            task=self.task,
            biometric=self.biometric,
            min_value=60.0,
            max_value=120.0
        )

        # Add peak metadata for scene
        self.peak_meta = BioPeakMetadata.objects.create(
            scene=self.scene,
            biometric=self.biometric,
            participant=self.participant
        )

    def test_scene_retrieval(self):
        url = reverse('SceneBiometrics', kwargs={
            'city': self.city.name,
            'thematicName': self.thematic.name,
            'axis_id': self.axis.axis_id_in_thematic,
            'scene_in_axis': 1
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['color'], '#FF0000')
        self.assertIn('scene', response.data)
        self.assertIn('files', response.data['scene'])
        self.assertIn('bio_meta', response.data['scene'])
        
        # Verify biometric metadata
        bio_meta = response.data['scene']['bio_meta']
        self.assertEqual(len(bio_meta), 1)
        self.assertEqual(bio_meta[0]['biometric'], 'HR')
        self.assertEqual(bio_meta[0]['min_value'], 60.0)
        self.assertEqual(bio_meta[0]['max_value'], 120.0)

    def test_scene_not_found(self):
        url = reverse('SceneBiometrics', kwargs={
            'city': self.city.name,
            'thematicName': self.thematic.name,
            'axis_id': 999,  # Non-existent axis
            'scene_in_axis': 1
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)