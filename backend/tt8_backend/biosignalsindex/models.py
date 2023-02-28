from django.db import models
from tt8_backend.settings import DATA_DIR

# Create your models here.
class ThematicUnit(models.Model):
	name = models.CharField(max_length=255)

class Session(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
	)
	session_id_in_thematic = models.IntegerField()

class Participant(models.Model):
	session = models.ForeignKey(
		'Session',
		on_delete = models.CASCADE,
	)
	participant_id_in_session = models.IntegerField()

class Axis(models.Model):
	thematic = models.ForeignKey(
		'ThematicUnit',
		on_delete = models.CASCADE,
	)
	axis_id_in_thematic = models.IntegerField()
	description = models.TextField()
	color = models.CharField(max_length=7) # This is a hexadecimal color code. Something like this: "#FF0000"

class Episode(models.Model):
	session = models.ForeignKey(
		'Session',
		on_delete = models.CASCADE,
	)
	axis = models.ManyToManyField('Axis', related_name = 'axis_episodes')

class ParticipantMaterial(models.Model):
	GRAPH = 'GR'
	RAW = 'RAW'
	TYPE_CHOICES = [
		(GRAPH, 'Graph'),
		(RAW, 'Raw data'),
	]
	HEART = 'HR'
	GSR = 'SC'
	TEMP = 'TEMP'
	BIOSIGNAL_CHOICES = [
		(HEART, 'Heart Rate'),
		(GSR, 'Skin Conductance'),
		(TEMP, 'Temperature'),
	]
	participant = models.ForeignKey(
		'Participant',
		on_delete = models.CASCADE,
	)
	episode = models.ForeignKey(
		'Episode',
		on_delete = models.CASCADE,
	)
	friendly_name = models.CharField(max_length=255) # Something like 'Participant 1 heart rate in episode 3'
	description = models.TextField()
	file_type = models.CharField(
		choices = TYPE_CHOICES,
		max_length = 3,
	)
	biosignal = models.CharField(
		choices = BIOSIGNAL_CHOICES,
		max_length = 4,
	)
	path = models.FilePathField(path=DATA_DIR, recursive=True)