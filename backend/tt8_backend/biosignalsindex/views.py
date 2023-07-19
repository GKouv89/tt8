# from django.shortcuts import render
from .models import Biometric, Axis, Scene
from django.db.models import Count
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import SceneinTaskMetaSerializer, BioPeakMetaSerializer, AxisSerializer

# Create your views here.
        
class ThematicScenesView(generics.ListAPIView):
    serializer_class = AxisSerializer
    def get_queryset(self, thematicName):
        try:
            return Axis.objects.filter(thematic__name=thematicName).order_by('axis_id_in_thematic').annotate(scene_count=Count("scenes"))
        except:
            return None

    def list(self, _, thematicName):
        qs = self.get_queryset(thematicName)
        if qs is not None:
            serializer = AxisSerializer(qs, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SceneBiometricsView(generics.RetrieveAPIView):
    serializer_class = SceneinTaskMetaSerializer
    def get_object(self, thematicName, axis_id, scene_in_axis):
        try:
            axis = Axis.objects.get_by_natural_key(thematic=thematicName, axis_id_in_thematic=axis_id)
            return axis.scenes.all()[scene_in_axis - 1]
        except:
            return None
        
    def get(self, _, thematicName, axis_id, scene_in_axis):
        scene = self.get_object(thematicName, axis_id, scene_in_axis)
        tasks = scene.meta.all().order_by('task_order')
        if scene is not None:
            serializer = self.serializer_class(tasks, many=True, context={'scene_pk':scene.pk})
            response_enhanced = {'meta': serializer.data}
            axis = scene.axis.get(axis_id_in_thematic=axis_id)
            response_enhanced['color'] = axis.color
            return Response(response_enhanced)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       



        
    

    
    
    


