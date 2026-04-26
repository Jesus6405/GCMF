#from django.shortcuts import render
from rest_framework import viewsets
from .serializer import (
    VehicleSerializer, OdometerLogSerializer, IncidentSerializer,
    MaintenanceOrderSerializer, PreventiveMaintenanceOrderSerializer, CorrectiveMaintenanceOrderSerializer,
    NotificationSerializer, MileageNotificationSerializer
)
from .models import (
    Vehicle, 
    OdometerLog, 
    Incident, 
    MaintenanceOrder, PreventiveMaintenanceOrder, CorrectiveMaintenanceOrder,
    Notification, MileageNotification
)

# Create your views here.
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class OdometerViewSet(viewsets.ModelViewSet):
    queryset = OdometerLog.objects.all()
    serializer_class = OdometerLogSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class MaintenanceOrderViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceOrder.objects.all()
    serializer_class = MaintenanceOrderSerializer

class PreventiveMaintenanceOrderViewSet(viewsets.ModelViewSet):
    queryset = PreventiveMaintenanceOrder.objects.all()
    serializer_class = PreventiveMaintenanceOrderSerializer

class CorrectiveMaintenanceOrderViewSet(viewsets.ModelViewSet):
    queryset = CorrectiveMaintenanceOrder.objects.all()
    serializer_class = CorrectiveMaintenanceOrderSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class MileageNotificationViewSet(viewsets.ModelViewSet):
    queryset = MileageNotification.objects.all()
    serializer_class = MileageNotificationSerializer