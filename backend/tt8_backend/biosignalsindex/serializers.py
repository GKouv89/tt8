from rest_framework import serializers
from .models import Axis, Scene, BioPeakMetadata, SceneInTaskMetadata, Task, File, BiometricMetadataForTask
from tt8_backend.settings import DATASTORE

class FileSerializer(serializers.ModelSerializer):
    participant = serializers.SlugRelatedField(
        read_only=True,
        slug_field='sensor_id_in_session',
    )

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
    files = FileSerializer(many=True, read_only=True)
    section = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    bio_meta = BioMetaSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['section', 'task_no_in_section', 'files', 'bio_meta']

class SceneinTaskMetaSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = SceneInTaskMetadata
        fields = ['task', 'task_order', 'starting_row', 'ending_row', 'starting_time', 'ending_time']

class BioPeakMetaSerializer(serializers.ModelSerializer):
    participant = serializers.SlugRelatedField(
        read_only=True,
        slug_field='sensor_id_in_session',
    )
    class Meta:
        model = BioPeakMetadata
        fields = ['participant']

class SceneBiometricsSerializer(serializers.ModelSerializer):
    meta = SceneinTaskMetaSerializer(read_only=True, many=True)

    class Meta:
        model = Scene
        fields = ['meta']

class AxisSerializer(serializers.ModelSerializer):
    scene_count = serializers.IntegerField()
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'title', 'color', 'scene_count']
    