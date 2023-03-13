from rest_framework import serializers
from .models import Axis, ParticipantMaterial
from tt8_backend.settings import DOMAIN_DIR

class EpisodeBiometricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParticipantMaterial
        fields = ['participant', 'friendly_name', 'path']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['path'] = '{}/{}'.format(DOMAIN_DIR, ret['path'])
        return ret