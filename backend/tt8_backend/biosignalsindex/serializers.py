from rest_framework import serializers
from .models import Scene, Axis, SceneInTaskMetadata, Task, File, BiometricMetadataForTask
from tt8_backend.settings import DATASTORE
    
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
            redundant = set(exclude)
            for field_name in redundant:
                self.fields.pop(field_name)

class FileSerializer(DynamicFieldsModelSerializer):
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
        slug_field='abbr',
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
        files = instance.files.all().order_by('participant__sensor_id_in_session')
        return FileSerializer(files, many=True, exclude=[]).data

class SceneinTaskMetaSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = SceneInTaskMetadata
        fields = ['task', 'task_order', 'starting_row', 'ending_row']

class SceneInTaskSerializer(serializers.ModelSerializer):
    meta = serializers.SerializerMethodField()
    peak_meta = serializers.SerializerMethodField()

    class Meta:
        model = Scene
        fields = ['scene_id_in_session', 'is_superepisode', 'starting_time', 'ending_time', 'meta', 'peak_meta']

    def get_meta(self, instance):
        meta = instance.meta.all().order_by('task_order')
        return SceneinTaskMetaSerializer(meta, many=True).data

    def get_peak_meta(self, instance):
        peaks = instance.peak_meta.order_by('participant__sensor_id_in_session').values('participant__sensor_id_in_session', 'biometric__abbr').distinct()
        res = []
        for peak in peaks:
            if len(res) == 0 or peak['participant__sensor_id_in_session'] != res[-1]['participant']:
                pass
                res.append({'participant': peak['participant__sensor_id_in_session'], 'peaks': [peak['biometric__abbr']]})
            else:
                res[-1]['peaks'].append(peak['biometric__abbr'])
        return res


class AxisSerializer(serializers.ModelSerializer):
    scene_count = serializers.IntegerField()
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'title', 'color', 'scene_count']
    