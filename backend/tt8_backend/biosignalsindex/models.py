from django.db import models
from django.db.models import Count, Value, Window, F, Q
from django.db.models.functions import DenseRank, Rank, RowNumber
from django_cte import CTEManager, With
# Create your models here.

class CityManager(models.Manager):
	def get_by_natural_key(self, name):
		return self.get(name=name)

class City(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    objects = CityManager()

    def natural_key(self):
        return (self.name,)

class ThematicManager(models.Manager):
	def get_by_natural_key(self, city_name, name):
		return self.get(name=name, city__name=city_name)

class ThematicUnit(models.Model):
	name = models.CharField(max_length=255)
	city = models.ForeignKey(
        'City',
        on_delete=models.CASCADE,
        related_name='thematics',
    )
	description = models.TextField(blank=True)  # This is the description to appear in the accordion in the frontend
    
	objects = ThematicManager()

	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=["city", "name"],
				name="unique_city_thematic", 
			)
		]

	def natural_key(self):
		return self.city.natural_key() + (self.name,)

class SociodramaSessionManager(models.Manager):
	def get_by_natural_key(self, city_name, thematic_name, session_id_in_thematic):
		return self.get(
			thematic__name=thematic_name, 
			thematic__city__name=city_name,
			session_id_in_thematic=session_id_in_thematic
		)

class SociodramaSession(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'sessions',
	)
	city = models.ForeignKey('City', 
		on_delete=models.CASCADE, 
		related_name='sessions',
	)
	session_id_in_thematic = models.IntegerField()

	objects = SociodramaSessionManager()

	class Meta:
		constraints = [
            models.UniqueConstraint(
                fields=["city", "thematic", "session_id_in_thematic"],
                name="unique_thematic_session_per_city",
            ),
        ]

	def natural_key(self):
		return self.thematic.natural_key() + (self.session_id_in_thematic,)
	
	natural_key.dependencies = ["biosignalsindex.ThematicUnit"]

class AxisManager(models.Manager):
	def get_by_natural_key(self, city, thematic, axis_id_in_thematic):
		return self.get(city__name=city, thematic__name=thematic, axis_id_in_thematic=axis_id_in_thematic)

class Axis(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'axes',
	)
	# The same axis technically exists in multiple cities, specifically, the 3 pilots from Creative Europe all focus on one shared axis.
	# But with current implementation, if this were a ManyToManyField, a) we would not be able to enforce unique axis IDs per city+thematic, 
	# and b) retrieving scenes per axis in the ThematicScenesView would mean an additional foreign key between scene and city, and filtering scenes by both axis and city. 
	# Unnecessery filtering in each retrieval, and instead our compromise is to duplicate axis entries per city.
	city = models.ForeignKey(
        'City',
        on_delete=models.CASCADE,
        related_name='axes',
    )
	axis_id_in_thematic = models.IntegerField()
	title = models.TextField()
	color = models.CharField(max_length=7) # This is a hexadecimal color code. Something like this: "#FF0000"

	objects = AxisManager()

	class Meta:
		constraints = [
			# Example: In creative Europe, the three new pilots all have the same one Axis under 'Environment' (thematic), but it is three different cities. 
            models.UniqueConstraint(
                fields=["city", "thematic", "axis_id_in_thematic"],
                name="unique_thematic_axis_per_city",
            ),
        ]

	def natural_key(self):
		return self.thematic.natural_key() + (self.axis_id_in_thematic, )
	
	@property
	def sharedScenes(self):
		scenes = Scene.objects.prefetch_related('axis').annotate(Count('axis')).filter(axis=self)
		cte = With(
			scenes.annotate(order=Window(DenseRank(), order_by=["session__session_id_in_thematic", "scene_id_in_session"]))
		)
		shared_scenes = cte.queryset().with_cte(cte).exclude(axis__count=1)
		return shared_scenes

	@property
	def scene_count(self):
		return self.scenes.count()

	natural_key.dependencies = ["biosignalsindex.ThematicUnit"]

class ParticipantManager(CTEManager):
	def get_by_natural_key(self, city_name, thematic, session_id, sensor_id_in_session):
		return self.get(session__session_id_in_thematic=session_id, session__thematic__name=thematic, session__thematic__city__name=city_name, sensor_id_in_session=sensor_id_in_session)

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

	@property
	def order(self):
		cte = With(
			Participant.objects.filter(session=self.session).alias(fileCount = Count('files')).filter(fileCount__gte=1)
		)
		everyone = cte.queryset().with_cte(cte)
		ranked = everyone.annotate(rank=Window(RowNumber(), order_by='sensor_id_in_session'))
		return ranked.get(id=self.id).rank

	def get_ordered_participant(session, participant_rank):
		pass
		cte = With(
			Participant.objects.filter(session=session).alias(fileCount = Count('files')).filter(fileCount__gte=1)
		)
		everyone = cte.queryset().with_cte(cte)
		ranked = everyone.annotate(rank=Window(RowNumber(), order_by='sensor_id_in_session'))
		return ranked.get(rank=participant_rank)
		

	natural_key.dependencies = ["biosignalsindex.SociodramaSession"]


class SectionManager(models.Manager):
	def get_by_natural_key(self, city, thematic, session_id, section_name):
		return self.get(
			session__session_id_in_thematic=session_id, 
			session__thematic__name=thematic, 
			session__thematic__city__name=city,
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
	# def get_by_natural_key(self, thematic, session_id, section_name, task_no):
	def get_by_natural_key(self, *args):
		# Creative Europe pilots do not have sections
		if len(args) == 4:
			# No section case
			city, thematic, session_id, task_no = args
			return self.get(
				task_no_in_section=task_no, 
				section__isnull=True,
				session__session_id_in_thematic=session_id,
				session__thematic__name=thematic,
				session__thematic__city__name=city
			)
		else:
			# Original Project sessions do
			city, thematic, session_id, section_name, task_no = args
			return self.get(
				task_no_in_section=task_no, 
				section__name=section_name, 
				section__session__session_id_in_thematic=session_id,
				section__session__thematic__name=thematic,
				section__session__thematic__city__name=city
			)
	
class Task(SessionPiece):
	section = models.ForeignKey(
		'Section',
		on_delete = models.CASCADE,
		related_name = 'tasks',
		null=True, # new pilots in creative europe do not have sections
		blank=True,
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
				condition=Q(section__isnull=False),
            ),
			models.UniqueConstraint(
				# If the pilot does not have sections, we still want to ensure that task numbers are unique per session
				fields=["session", "task_no_in_section"],
				name="unique_session_task",
				condition=Q(section__isnull=True),
			),
        ]

	def natural_key(self):
		if self.section is None:
			return self.session.natural_key() + (self.task_no_in_section,)
		else:
			return self.section.natural_key() + (self.task_no_in_section,)

	natural_key.dependencies = ["biosignalsindex.Section", "biosignalsindex.SociodramaSession"]

class SceneManager(CTEManager):
	def get_by_natural_key(self, city_name, thematic, session_id, scene_no):
		return self.get(
			scene_id_in_session=scene_no,  
			session__session_id_in_thematic=session_id,
			session__thematic__name=thematic,
			session__thematic__city__name=city_name
		)

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
	
	@property
	def task_start(self):
		first_task = self.meta.order_by('task_order').first()
		return first_task.task.starting_time
	
	@property
	def task_end(self):
		last_task = self.meta.order_by('-task_order').first()
		return last_task.task.ending_time
	
	def get_vis_files(self):
		if(self.is_superepisode):
			tasks =  self.meta.order_by('task_order')
			if tasks.count() == 1:
				return tasks.first().task.files.order_by('participant__sensor_id_in_session').annotate(order=Window(DenseRank(), order_by='participant__sensor_id_in_session'))

			qs_list = []
			for t in tasks:
				files = File.objects.filter(task=t.task).annotate(task_order=Value(t.task_order)).annotate(order=Window(DenseRank(), order_by='participant__sensor_id_in_session'))
				qs_list.append(files)
			return qs_list[0].union(qs_list[1]).order_by('task_order')
		else:
			return self.files.order_by('participant__sensor_id_in_session').annotate(order=Window(DenseRank(), order_by='participant__sensor_id_in_session'))

	def get_peak_meta(self):
		return self.peak_meta.order_by('participant__sensor_id_in_session').values('participant__sensor_id_in_session', 'biometric__abbr').distinct()

	def biometric_minimum(self, abbr):
		meta = [task.bio_meta.get(biometric__abbr=abbr) for task in self.task.prefetch_related('bio_meta')]
		mini = [m.min_value for m in meta]
		return min(mini)
	
	def biometric_maximum(self, abbr):
		meta = [task.bio_meta.get(biometric__abbr=abbr) for task in self.task.prefetch_related('bio_meta')]
		maxi = [m.max_value for m in meta]
		return max(maxi)
	
	@property
	def starting_row(self):
		first_task_meta = self.meta.order_by('task_order').first()
		return first_task_meta.starting_row
	
	@property
	def ending_row(self):
		# This takes for granted the task is split between the end of the first task and the start of the second
		# That is, there are only 2 tasks in a scene at most.
		return sum([meta.ending_row for meta in self.meta.order_by('task_order')])

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

class BiometricMetadataForScene(models.Model):
	# This is the metadata per scene, for the selected scenes only
	# During preprossesing phase, we find the min and max value
	# per biometric, so we can plot the diagrams with the same values
	# as reference points.
	scene = models.ForeignKey(
		'Scene',
		on_delete=models.CASCADE,
		related_name='bio_meta',
	)

	biometric = models.ForeignKey(
		'Biometric',
		on_delete=models.CASCADE,
		related_name='scenes_meta',
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

