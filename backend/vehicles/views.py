#from django.shortcuts import render
from rest_framework import viewsets
from .serializer import VehicleSerializer
from .models import Vehicle
from .serializer import OdometerLogSerializer
from .models import OdometerLog

# Create your views here.
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class OdometerViewSet(viewsets.ModelViewSet):
    queryset = OdometerLog.objects.all()
    serializer_class = OdometerLogSerializer