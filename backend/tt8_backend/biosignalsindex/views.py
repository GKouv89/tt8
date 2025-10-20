# from django.shortcuts import render
from .models import ThematicUnit, Participant, Axis, File, City
from django.db.models import Count
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import ThematicSerializer, CitySerializer, SceneInTaskSerializer, FileSerializer, AxisSerializer, SelectedSceneSerializer

# Create your views here.

class CitiesView(generics.ListAPIView):
    """Returns all available cities."""
    serializer_class = CitySerializer
    def get_queryset(self):
        return City.objects.all()
    
class CityThematicsView(generics.ListAPIView):
    """Returns thematics available in specified city."""
    serializer_class = ThematicSerializer
    def get_queryset(self):
        try:
            cityName = self.kwargs['city']
            return ThematicUnit.objects.filter(city__name=cityName)
        except:
            return None
        
class ThematicScenesView(generics.ListAPIView):
    """Returns axes and their scenes for a specified thematic in a specified city."""
    serializer_class = AxisSerializer
    def get_queryset(self, cityName, thematicName):
        try:
            return Axis.objects.filter(
                city=cityName, 
                thematic=thematicName
            ).order_by('axis_id_in_thematic')
        except:
            return None

    def list(self, _, city, thematicName):
        qs = self.get_queryset(city, thematicName)
        if qs is not None:
            serializer = AxisSerializer(qs, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SceneBiometricsView(generics.RetrieveAPIView):
    """Returns biometrics metadata for a specified scene in a specified axis, thematic and city"""
    serializer_class = SceneInTaskSerializer

    def get_object(self, cityName, thematicName, axis_id, scene_in_axis):
        try:
            axis = Axis.objects.get_by_natural_key(
                city=cityName, 
                thematic=thematicName, 
                axis_id_in_thematic=axis_id)
            return axis.scenes.all()[scene_in_axis - 1]
        except:
            return None
        
    # def get(self, _, cityName, thematicName, axis_id, scene_in_axis):
    def get(self, _, *args, **kwargs):
        cityName = self.kwargs['city']
        thematicName = self.kwargs['thematicName']
        axis_id = self.kwargs['axis_id']
        scene_in_axis = self.kwargs['scene_in_axis']
        scene = self.get_object(cityName, thematicName, axis_id, scene_in_axis)
        """This is a bit of a custom response. Basically, beside the relevant scene metadata, we also want the axis color to use in our visualization.
        By also seeing the axis from the url, we ensure that it is the correct axis color, for scenes that are shared between axes."""
        if scene is not None:
            serializer = self.serializer_class(scene) if scene.is_superepisode else SelectedSceneSerializer(scene)
            response_enhanced = {'scene': serializer.data}
            axis = scene.axis.get(axis_id_in_thematic=axis_id)
            response_enhanced['color'] = axis.color
            return Response(response_enhanced)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       
        
class SceneParticipantBiometricsView(generics.RetrieveAPIView):
    """Returns biometric files for a specified participant in a specified scene, axis, thematic and city."""
    serializer_class = FileSerializer
    def get_object(self, cityName, thematicName, axis_id, scene_in_axis, participant_id):
        try: 
            scene = Axis.objects.get_by_natural_key(
                cityName, 
                thematicName, 
                axis_id
            ).scenes.all()[scene_in_axis-1]
            participant = Participant.get_ordered_participant(scene.session, participant_id)
            file = File.objects.get(scene=scene, participant=participant)
            return file
        except:
            return None

    def get(self, _, cityName, thematicName, axis_id, scene_in_axis, participant_id):
        file = self.get_object(cityName, thematicName, axis_id, scene_in_axis, participant_id)
        if file is not None:
            serializer = self.serializer_class(file, exclude=["participant"])
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       





        
    

    
    
    


