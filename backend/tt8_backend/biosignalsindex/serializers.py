from rest_framework import serializers
from .models import Axis, ParticipantMaterial, Episode
from tt8_backend.settings import DATASTORE

class EpisodeBiometricsSerializer(serializers.ModelSerializer):
    participant = serializers.SlugRelatedField(
        read_only = True,
        slug_field = 'sensor_id_in_session'
    )

    class Meta:
        model = ParticipantMaterial
        fields = ['participant', 'friendly_name', 'path']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # ret['path'] = '{}/{}'.format(DOMAIN_DIR, ret['path'])
        ret['path'] = '{}/{}'.format(DATASTORE, ret['path'])
        ret['friendly_name'] = ret['friendly_name'].replace(' All Biometrics', '')
        return ret
    
class AxisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'color']

class SceneSerializer(serializers.ModelSerializer):
    axis = AxisSerializer(many=True)
    class Meta:
        model = Episode
        fields = ['episode_id_in_session', 'axis']
