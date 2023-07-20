from .views import *
from django.urls import path, include

urlpatterns = [
    path('thematics/<str:thematicName>/scenes/', ThematicScenesView.as_view(), name='ThematicScenes'),
    path('thematics/<str:thematicName>/axes/<int:axis_id>/scenes/<int:scene_in_axis>/biometrics/', SceneBiometricsView.as_view(), name='SceneBiometrics'),
    path('thematics/<str:thematicName>/axes/<int:axis_id>/scenes/<int:scene_in_axis>/biometrics/<int:participant_id>/', SceneParticipantBiometricsView.as_view(), name='ParticipantBiometrics'),
]