from rest_framework import serializers
from .models import Axis

class AxisResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Axis
        fields = ['color']