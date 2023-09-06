# from django.shortcuts import render
from .models import Participant, Axis, File
from django.db.models import Count
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import SceneInTaskSerializer, FileSerializer, AxisSerializer, SelectedSceneSerializer

# Create your views here.
        
class ThematicScenesView(generics.ListAPIView):
    serializer_class = AxisSerializer
    def get_queryset(self, thematicName):
        try:
            return Axis.objects.filter(thematic__name=thematicName).order_by('axis_id_in_thematic')
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
    serializer_class = SceneInTaskSerializer

    def get_object(self, thematicName, axis_id, scene_in_axis):
        try:
            axis = Axis.objects.get_by_natural_key(thematic=thematicName, axis_id_in_thematic=axis_id)
            return axis.scenes.all()[scene_in_axis - 1]
        except:
            return None
        
    def get(self, _, thematicName, axis_id, scene_in_axis):
        scene = self.get_object(thematicName, axis_id, scene_in_axis)
        if scene is not None:
            serializer = self.serializer_class(scene) if scene.is_superepisode else SelectedSceneSerializer(scene)
            response_enhanced = {'scene': serializer.data}
            axis = scene.axis.get(axis_id_in_thematic=axis_id)
            response_enhanced['color'] = axis.color
            return Response(response_enhanced)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       
        
class SceneParticipantBiometricsView(generics.RetrieveAPIView):
    serializer_class = FileSerializer
    def get_object(self, thematicName, axis_id, scene_in_axis, participant_id):
        try: 
            scene = Axis.objects.get_by_natural_key(thematicName, axis_id).scenes.all()[scene_in_axis-1]
            participant = Participant.get_ordered_participant(scene.session, participant_id)
            file = File.objects.get(scene=scene, participant=participant)
            return file
        except:
            return None

    def get(self, _, thematicName, axis_id, scene_in_axis, participant_id):
        file = self.get_object(thematicName, axis_id, scene_in_axis, participant_id)
        if file is not None:
            serializer = self.serializer_class(file, exclude=["participant"])
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       





        
    

    
    
    


