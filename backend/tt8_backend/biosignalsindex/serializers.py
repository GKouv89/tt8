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
        ret['path'] = '{}/{}'.format(DATASTORE, ret['path'])
        ret['friendly_name'] = ret['friendly_name'].replace(' All Biometrics', '')
        return ret

class CustomEpisodeSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        new_data = []
        for idx, item in enumerate(data.all()):
            new_item = self.child.to_representation(item)
            axes = item.axis.all()
            if len(axes) != 1:
                colors = [axis.color for axis in axes]
                new_item['colors'] = colors
            new_item['ep_id'] = idx + 1
            new_data.append(new_item)
        return new_data

class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = ['episode_id_in_session', 'session']
        list_serializer_class = CustomEpisodeSerializer

class AxisSerializer(serializers.ModelSerializer):
    episodes = EpisodeSerializer(many=True)

    class Meta:
        model = Axis
        fields = ['axis_id_in_thematic', 'color', 'title', 'episodes']
        depth = 1

    