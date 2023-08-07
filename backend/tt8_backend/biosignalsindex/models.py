from django.db import models
# Create your models here.

class ThematicManager(models.Manager):
	def get_by_natural_key(self, name):
		return self.get(name=name)

class ThematicUnit(models.Model):
	name = models.CharField(max_length=255, unique=True)
	
	objects = ThematicManager()

	def natural_key(self):
		return (self.name,)

class SociodramaSessionManager(models.Manager):
	def get_by_natural_key(self, thematic_name, session_id_in_thematic):
		return self.get(thematic__name=thematic_name, session_id_in_thematic=session_id_in_thematic)

class SociodramaSession(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'sessions',
	)
	session_id_in_thematic = models.IntegerField()

	objects = SociodramaSessionManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["thematic", "session_id_in_thematic"],
                name="unique_thematic_session",
            ),
        ]

	def natural_key(self):
		return self.thematic.natural_key() + (self.session_id_in_thematic,)
	
	natural_key.dependencies = ["biosignalsindex.ThematicUnit"]

class AxisManager(models.Manager):
	def get_by_natural_key(self, thematic, axis_id_in_thematic):
		return self.get(thematic__name=thematic, axis_id_in_thematic=axis_id_in_thematic)

class Axis(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'axes',
	)
	axis_id_in_thematic = models.IntegerField()
	title = models.TextField()
	color = models.CharField(max_length=7) # This is a hexadecimal color code. Something like this: "#FF0000"

	objects = AxisManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["thematic", "axis_id_in_thematic"],
                name="unique_thematic_axis",
            ),
        ]

	def natural_key(self):
		return self.thematic.natural_key() + (self.axis_id_in_thematic, )
	
	natural_key.dependencies = ["biosignalsindex.ThematicUnit"]

class ParticipantManager(models.Manager):
	def get_by_natural_key(self, thematic, session_id, sensor_id_in_session):
		return self.get(session__session_id_in_thematic=session_id, session__thematic__name=thematic, sensor_id_in_session=sensor_id_in_session)

class Participant(models.Model):
	session = models.ForeignKey(
		'SociodramaSession',
		on_delete = models.CASCADE,
		related_name = 'participants',
	)
	sensor_id_in_session = models.IntegerField()

	objects=ParticipantManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["session", "sensor_id_in_session"],
                name="unique_session_sensor",
            ),
        ]

	def natural_key(self):
		return self.session.natural_key() + (self.sensor_id_in_session,)
	
	natural_key.dependencies = ["biosignalsindex.SociodramaSession"]

class SectionManager(models.Manager):
	def get_by_natural_key(self, thematic, session_id, section_name):
		return self.get(
			session__session_id_in_thematic=session_id, 
			session__thematic__name=thematic, 
			name=section_name)

class Section(models.Model):
	name = models.CharField(max_length=32)
	session = models.ForeignKey(
		'SociodramaSession',
		on_delete = models.CASCADE,
		related_name = 'sections',
	)

	objects = SectionManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["session", "name"],
                name="unique_session_section",
            ),
        ]

	def natural_key(self):
		return self.session.natural_key() + (self.name,)

	natural_key.dependencies = ["biosignalsindex.SociodramaSession"]

class SessionPiece(models.Model):
	session = models.ForeignKey(
		'SociodramaSession',
		on_delete=models.CASCADE,
		related_name='%(class)s',
	)

	class Meta:
		abstract=True


class TaskManager(models.Manager):
	def get_by_natural_key(self, thematic, session_id, section_name, task_no):
		return self.get(
			task_no_in_section=task_no, 
			section__name=section_name, 
			section__session__session_id_in_thematic=session_id,
			section__session__thematic__name=thematic)
	
class Task(SessionPiece):
	section = models.ForeignKey(
		'Section',
		on_delete = models.CASCADE,
		related_name = 'tasks',
	)
	task_no_in_section = models.IntegerField()
	starting_time = models.FloatField()
	ending_time = models.FloatField()

	objects = TaskManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["section", "task_no_in_section"],
                name="unique_section_task",
            ),
        ]

	def natural_key(self):
		return self.section.natural_key() + (self.task_no_in_section,)

	natural_key.dependencies = ["biosignalsindex.Section"]

class SceneManager(models.Manager):
	def get_by_natural_key(self, thematic, session_id, scene_no):
		return self.get(
			scene_id_in_session=scene_no,  
			session__session_id_in_thematic=session_id,
			session__thematic__name=thematic)

class Scene(SessionPiece):
	task = models.ManyToManyField(
		'Task',
		related_name = 'scenes',
		through='SceneInTaskMetadata',
	)
	axis = models.ManyToManyField('Axis', related_name = 'scenes')
	is_superepisode = models.BooleanField(default=True)
	scene_id_in_session = models.IntegerField()
	starting_time = models.FloatField(null=True)
	ending_time = models.FloatField(null=True)

	objects = SceneManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["session", "scene_id_in_session"],
                name="unique_session_scene",
            ),
        ]
		ordering = [
			'session__session_id_in_thematic',
            'scene_id_in_session',
		]

	def natural_key(self):
		return self.session.natural_key() + (self.scene_id_in_session,)

	natural_key.dependencies = ["biosignalsindex.SociodramaSession"]

class SceneInTaskMetadata(models.Model):
	scene = models.ForeignKey('Scene', 
		on_delete=models.CASCADE,
		related_name='meta'
	)
	task = models.ForeignKey(
		'Task', 
		on_delete=models.CASCADE,
		related_name='meta'
	)
	task_order = models.IntegerField()
	starting_row = models.IntegerField()
	ending_row = models.IntegerField()

class File(models.Model):	
	task = models.ForeignKey(
		'Task',
		on_delete=models.CASCADE,
		related_name='files',
		null=True
	)
	scene = models.ForeignKey(
		'Scene',
		on_delete=models.CASCADE,
		related_name='files',
		null=True
	)

	participant = models.ForeignKey(
		'Participant', 
		on_delete=models.CASCADE,
		related_name='files',
	)
	path = models.CharField(max_length=512,)

	class Meta:
		constraints = [
            models.CheckConstraint(check=models.Q(task__isnull=False) ^ models.Q(scene__isnull=False), name="one_of_two_not_null"),
        ]

class BiometricManager(models.Manager):
	def get_by_natural_key(self, abbreviation):
		return self.get(abbr=abbreviation)

class Biometric(models.Model):
	name=models.CharField(unique=True,max_length=16)
	abbr=models.CharField(unique=True, max_length=4)
	tasks = models.ManyToManyField(
		Task,
		related_name='bio_metadata',
		through='BiometricMetadataForTask',
	)
	scene_peaks = models.ManyToManyField(
		Scene,
		related_name='peak_metadata',
		through='BioPeakMetadata',
	)
	objects = BiometricManager()

	def natural_key(self):
		return (self.abbr,)
	
class BiometricMetadataForTask(models.Model):
	# This is the metadata per task
	# During preprossesing phase, we find the min and max value
	# per biometric, so we can plot the diagrams with the same values
	# as reference points.
	task = models.ForeignKey(
		'Task', 
		on_delete=models.CASCADE,
		related_name='bio_meta',
	)

	biometric = models.ForeignKey(
		'Biometric',
		on_delete=models.CASCADE,
		related_name='tasks_meta',
	)

	min_value = models.FloatField()
	max_value = models.FloatField()

class BioPeakMetadata(models.Model):
	# If there is a superepisode in the task, then at least one participant
	# has a peak in at least one biometric, and this is recorded here
	# so that we can plot with a diacretic (a different color or line width)
	scene = models.ForeignKey(
		Scene, 
		on_delete=models.CASCADE,
		related_name='peak_meta',
	)

	biometric = models.ForeignKey(
		Biometric,
		on_delete=models.CASCADE,
		related_name='scene_peaks_meta',
	)
	
	participant = models.ForeignKey(
		Participant,
		on_delete=models.CASCADE,
		related_name='scene_peaks_meta'
	)

	class Meta:
		ordering = ['biometric__abbr', 'participant']

