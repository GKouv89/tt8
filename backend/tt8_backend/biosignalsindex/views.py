# from django.shortcuts import render
from .models import Axis
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import AxisResponseSerializer
# Create your views here.

class AxisView(generics.RetrieveAPIView):
    serializer_class = AxisResponseSerializer

    def get_queryset(self, thematicID):
        return Axis.objects.filter(thematic=thematicID)

    def get(self, request, thematicID, axisID):
        queryset = self.get_queryset(thematicID)
        if not queryset:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                axis = queryset.get(axis_id_in_thematic=axisID)
                serializer = AxisResponseSerializer(axis)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
    


