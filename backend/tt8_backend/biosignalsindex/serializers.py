from rest_framework import serializers
from .models import Axis, Participant, BioPeakMetadata, SceneInTaskMetadata, Task, File, BiometricMetadataForTask
from tt8_backend.settings import DATASTORE

class BioPeakMetaSerializer(serializers.ModelSerializer):
    biometric = serializers.SlugRelatedField(
        read_only = True,
        slug_field = 'abbr'
    )

    class Meta:
        model = BioPeakMetadata
        fields = ['biometric']

class ParticipantSerializer(serializers.ModelSerializer):
    scene_peaks_meta = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = ['sensor_id_in_session', 'scene_peaks_meta']

    def get_scene_peaks_meta(self, instance):
        return BioPeakMetaSerializer(instance.scene_peaks_meta.filter(scene=self.context['scene_pk']), many=True).data
    
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class FileSerializer(DynamicFieldsModelSerializer):
    participant = ParticipantSerializer(read_only=True)

    class Meta:
        model = File
        fields = ['participant', 'path']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['path'] = '{}/{}'.format(DATASTORE, ret['path'])
        return ret

class BioMetaSerializer(serializers.ModelSerializer):
    biometric = serializers.SlugRelatedField(
        read_only=True,
        slug_field='abbr'
    )

    class Meta:
        model = BiometricMetadataForTask
        exclude = ['id', 'task']

class TaskSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField()

    bio_meta = BioMetaSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['files', 'bio_meta']

    def get_files(self, instance):
        files = instance.files.all().order_by('participant__sensor_id_in_session')
        return FileSerializer(files, many=True, context=self.context).data

class SceneinTaskMetaSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = SceneInTaskMetadata
        fields = ['task', 'task_order', 'starting_row', 'ending_row', 'starting_time', 'ending_time']

class AxisSerializer(serializers.ModelSerializer):
    scene_count = serializers.IntegerField()
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'title', 'color', 'scene_count']
    