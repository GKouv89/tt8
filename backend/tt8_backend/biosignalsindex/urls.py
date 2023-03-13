from .views import *
from django.urls import path, include

urlpatterns = [
    path('thematics/<int:thematicID>/axes/<int:axisID>/', AxisView.as_view(), name='ThematicAxes'),
]