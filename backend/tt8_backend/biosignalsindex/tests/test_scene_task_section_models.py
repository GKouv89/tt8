from django.test import TestCase
from ..models import (
    City, ThematicUnit, SociodramaSession, 
    Section, Task, Scene, SceneInTaskMetadata
)

class SceneTaskTests(TestCase):
    def setUp(self):
        # Create base hierarchy
        self.city = City.objects.create(name="TestCity")
        self.thematic = ThematicUnit.objects.create(
            name="Environment",
            city=self.city
        )
        self.session = SociodramaSession.objects.create(
            thematic=self.thematic,
            city=self.city,
            session_id_in_thematic=1
        )

        # Create a task with section (original project)
        self.section = Section.objects.create(
            name="Warm-up",
            session=self.session
        )
        self.task_with_section = Task.objects.create(
            section=self.section,
            session=self.session,
            task_no_in_section=1,
            starting_time=0.0,
            ending_time=10.0
        )

        # Create a task without section (Creative Europe)
        self.task_without_section = Task.objects.create(
            session=self.session,
            task_no_in_section=2,
            starting_time=10.0,
            ending_time=20.0
        )

    def test_create_scene_with_sectioned_task(self):
        scene = Scene.objects.create(
            session=self.session,
            scene_id_in_session=1,
            is_superepisode=True,
            starting_time=2.0,
            ending_time=8.0
        )
        SceneInTaskMetadata.objects.create(
            scene=scene,
            task=self.task_with_section,
            task_order=1,
            starting_row=20,
            ending_row=80
        )
        
        self.assertEqual(scene.task.first(), self.task_with_section)
        self.assertEqual(scene.meta.first().starting_row, 20)

    def test_create_scene_with_sectionless_task(self):
        scene = Scene.objects.create(
            session=self.session,
            scene_id_in_session=2,
            is_superepisode=True,
            starting_time=12.0,
            ending_time=18.0
        )
        SceneInTaskMetadata.objects.create(
            scene=scene,
            task=self.task_without_section,
            task_order=1,
            starting_row=100,
            ending_row=160
        )
        
        self.assertEqual(scene.task.first(), self.task_without_section)
        self.assertIsNone(scene.task.first().section)

    def test_scene_spanning_multiple_tasks(self):
        scene = Scene.objects.create(
            session=self.session,
            scene_id_in_session=3,
            is_superepisode=True,
            starting_time=8.0,
            ending_time=12.0
        )
        # Scene spans end of first task and start of second
        SceneInTaskMetadata.objects.create(
            scene=scene,
            task=self.task_with_section,
            task_order=1,
            starting_row=80,
            ending_row=100
        )
        SceneInTaskMetadata.objects.create(
            scene=scene,
            task=self.task_without_section,
            task_order=2,
            starting_row=0,
            ending_row=20
        )
        
        self.assertEqual(scene.task.count(), 2)
        self.assertEqual(scene.starting_row, 80)
        self.assertEqual(scene.ending_row, 120)  # 100 + 20