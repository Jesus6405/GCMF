#from django.shortcuts import render
from rest_framework import viewsets
from .serializer import VehicleSerializer
from .models import Vehicle

# Create your views here.
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer