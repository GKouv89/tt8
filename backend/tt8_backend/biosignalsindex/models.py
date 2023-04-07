from django.db import models

# Create your models here.
class ThematicUnit(models.Model):
	name = models.CharField(max_length=255)

class SociodramaSession(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'sessions',
	)
	session_id_in_thematic = models.IntegerField()

class Participant(models.Model):
	session = models.ForeignKey(
		'SociodramaSession',
		on_delete = models.CASCADE,
		related_name = 'participants',
	)
	sensor_id_in_session = models.IntegerField()

class Axis(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
		related_name = 'axes',
	)
	axis_id_in_thematic = models.IntegerField()
	title = models.TextField()
	color = models.CharField(max_length=7) # This is a hexadecimal color code. Something like this: "#FF0000"

class Episode(models.Model):
	session = models.ForeignKey(
		'SociodramaSession',
		on_delete = models.CASCADE,
		related_name = 'episodes',
	)
	axis = models.ManyToManyField('Axis', related_name = 'episodes')
	is_superepisode = models.BooleanField(default=True)
	episode_id_in_session = models.IntegerField()

class ParticipantMaterial(models.Model):
	GRAPH = 'GR'
	RAW = 'RAW'
	TYPE_CHOICES = [
		(GRAPH, 'Graph'),
		(RAW, 'Raw data'),
	]
	# The biosignal choice might become redundant
	# if files end up following the format for the sample files
	# currently used by the front end.
	HEART = 'HR'
	GSR = 'SC'
	TEMP = 'TEMP'
	ALL = 'ALL'
	BIOSIGNAL_CHOICES = [
		(HEART, 'Heart Rate'),
		(GSR, 'Skin Conductance'),
		(TEMP, 'Temperature'),
		(ALL, 'All'),
	]
	participant = models.ForeignKey(
		'Participant',
		on_delete = models.CASCADE,
		related_name='biometrics',
	)
	episode = models.ForeignKey(
		'Episode',
		on_delete = models.CASCADE,
		related_name='material',
	)
	friendly_name = models.CharField(max_length=255) # Something like 'Participant 1 heart rate in episode 3'
	description = models.TextField(null=True)
	file_type = models.CharField(
		choices = TYPE_CHOICES,
		max_length = 3,
	)
	biosignal = models.CharField(
		choices = BIOSIGNAL_CHOICES,
		max_length = 4,
	)
	path = models.CharField(max_length=255)