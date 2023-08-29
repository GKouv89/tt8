from rest_framework import serializers
from .models import Scene, Axis, File, Biometric, BiometricMetadataForScene
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

class CustomFileListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        new_data = {}

        for file in data.all():
            new_file = self.child.to_representation(file)
            
            if new_file['participant'] in new_data.keys():
                new_data[new_file['participant']].append(new_file['path'])
            else:
                new_data[new_file['participant']] = [new_file['path']]

        res = []
        for d in new_data.keys():
            res.append({'participant': d, 'paths': new_data[d]})
        
        def sortingFunc(e):
            return e['participant']
        
        res.sort(key=sortingFunc)
        return res

class FileSerializer(DynamicFieldsModelSerializer):
    participant = serializers.SlugRelatedField(
        read_only=True,
        slug_field='sensor_id_in_session',
    )

    class Meta:
        model = File
        fields = ['participant', 'path']
        list_serializer_class = CustomFileListSerializer

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['path'] = '{}/{}'.format(DATASTORE, ret['path'])
        return ret

class SceneInTaskSerializer(serializers.ModelSerializer):
    peak_meta = serializers.SerializerMethodField()
    bio_meta = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()

    class Meta:
        model = Scene
        fields = ['scene_id_in_session', 'is_superepisode', 'starting_time', 'ending_time', 'starting_row', 'ending_row', 'task_start', 'task_end', 'peak_meta', 'files', 'bio_meta']

    def get_peak_meta(self, instance):
        peaks = instance.get_peak_meta()
        res = []
        for peak in peaks:
            if len(res) == 0 or peak['participant__sensor_id_in_session'] != res[-1]['participant']:
                res.append({'participant': peak['participant__sensor_id_in_session'], 'peaks': [peak['biometric__abbr']]})
            else:
                res[-1]['peaks'].append(peak['biometric__abbr'])
        return res
    
    def get_files(self, instance):
        files = instance.get_vis_files()
        serializer = FileSerializer(files, many=True, exclude=[])
        return serializer.data
    
    def get_bio_meta(self, instance):
        res = []
        for bio in Biometric.objects.all():
            abbr = bio.abbr
            res.append({'biometric': abbr, 'minimum': instance.biometric_minimum(abbr), 'maximum': instance.biometric_maximum(abbr)})
        return res
    
class BioMetaSerializer(serializers.ModelSerializer):
    biometric = serializers.SlugRelatedField(
        read_only=True,
        slug_field='abbr',
    )

    class Meta:
        model = BiometricMetadataForScene
        fields = ['biometric', 'min_value', 'max_value']
    
class SelectedSceneSerializer(serializers.ModelSerializer):
#   - Add bio_meta: This is not a serializer method field, instead it's all the entities associated with the specific scene.
    files = FileSerializer(many=True, read_only=True, exclude=[])
    bio_meta = BioMetaSerializer(many=True, read_only=True)

    class Meta:
        model = Scene
        fields = ['scene_id_in_session', 'is_superepisode', 'starting_time', 'ending_time', 'files', 'bio_meta']
    
class AxisSerializer(serializers.ModelSerializer):
    scene_count = serializers.IntegerField()
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'title', 'color', 'scene_count']
    