# from django.shortcuts import render
from .models import SociodramaSession, ParticipantMaterial
from django.db.models import Q
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import EpisodeBiometricsSerializer
# Create your views here.

class BiometricsView(generics.ListAPIView):
    serializer_class = EpisodeBiometricsSerializer
    def get_queryset(self, thematicID, sessionID, sceneID):
        try: 
            session = SociodramaSession.objects.get(Q(thematic=thematicID) & Q(session_id_in_thematic=sessionID))
            try:
                scene = session.episodes.get(episode_id_in_session=sceneID)
                return scene.material.filter(file_type=ParticipantMaterial.RAW)
            except:
                return None
        except:
            return None
            
    def list(self, request, thematicID, sessionID, sceneID):
        queryset = self.get_queryset(thematicID, sessionID, sceneID)
        if queryset is not None:
            serializer = EpisodeBiometricsSerializer(queryset, many=True)
            response_enhanced = {'material': serializer.data}
            if 'axis' in request.query_params.keys():
                try:
                    [response_enhanced['color']] = [axis.color for axis in queryset.first().episode.axis.all() if axis.axis_id_in_thematic == int(request.query_params['axis'])]
                except ValueError:
                   return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(response_enhanced)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    


