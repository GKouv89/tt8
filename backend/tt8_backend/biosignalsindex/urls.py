from .views import *
from django.urls import path, include

urlpatterns = [
    path('thematics/<int:thematicID>/sessions/<int:sessionID>/scenes/<int:sceneID>/biometrics/', BiometricsView.as_view(), name='EpisodeBiometrics'),
]