from rest_framework import serializers
from .models import Scene, Axis, Participant, BioPeakMetadata, SceneInTaskMetadata, Task, File, BiometricMetadataForTask
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
        print('scene pk: ', self.context['scene_pk'])
        print('participant id: ', instance.id)
        print('participant natural key: ', instance.natural_key())
        peaks = instance.scene_peaks_meta.filter(scene=self.context['scene_pk'])
        print('count: ', peaks.count())
        for peak in peaks:
            print(peak.biometric.abbr)
        return BioPeakMetaSerializer(peaks, many=True).data
    
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        # fields = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if exclude is not None:
            # Drop any fields that are specified in the `exclude` argument.
            # existing = set(self.fields)
            redundant = set(exclude)
            for field_name in redundant:
                self.fields.pop(field_name)

        # if fields is not None:
        #     # Drop any fields that are not specified in the `fields` argument.
        #     allowed = set(fields)
        #     existing = set(self.fields)
        #     for field_name in existing - allowed:
        #         self.fields.pop(field_name)

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
        fields = ['files', 'bio_meta', 'starting_time', 'ending_time']

    def get_files(self, instance):
        print(self.context['scene_pk'])
        files = instance.files.all().order_by('participant__sensor_id_in_session')
        for file in files:
            print(file.participant.natural_key())
        return FileSerializer(files, many=True, context=self.context, exclude=[]).data

class SceneinTaskMetaSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = SceneInTaskMetadata
        fields = ['task', 'task_order', 'starting_row', 'ending_row']

class SceneInTaskSerializer(DynamicFieldsModelSerializer):
    meta = serializers.SerializerMethodField()
    files = FileSerializer(read_only=True)

    class Meta:
        model = Scene
        fields = ['scene_id_in_session', 'is_superepisode', 'starting_time', 'ending_time', 'meta', 'files']

    def get_meta(self, instance):
        meta = instance.meta.all().order_by('task_order')
        return SceneinTaskMetaSerializer(meta, many=True, context=self.context).data


class AxisSerializer(serializers.ModelSerializer):
    scene_count = serializers.IntegerField()
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'title', 'color', 'scene_count']
    