#from django.shortcuts import render
from rest_framework import viewsets
from .serializer import (
    VehicleSerializer, OdometerLogSerializer, IncidentSerializer,
    MaintenanceOrderSerializer, PreventiveMaintenanceOrderSerializer, CorrectiveMaintenanceOrderSerializer
)
from .models import (
    Vehicle, OdometerLog, Incident, 
    MaintenanceOrder, PreventiveMaintenanceOrder, CorrectiveMaintenanceOrder
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
    queryset = MaintenanceOrder.objects.all().select_related(
        'preventivemaintenanceorder', 
        'correctivemaintenanceorder'
    )

    def get_object(self):
        # Obtenemos la instancia base
        obj = super().get_object()
        
        # "Downcasting" manual: si es preventiva, devolvemos la instancia de la hija
        if obj.order_type == 'PREVENTIVE' and hasattr(obj, 'preventivemaintenanceorder'):
            return obj.preventivemaintenanceorder
        if obj.order_type == 'CORRECTIVE' and hasattr(obj, 'correctivemaintenanceorder'):
            return obj.correctivemaintenanceorder
        return obj

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            # 1. Buscamos el tipo en los datos enviados
            order_type = self.request.data.get('order_type')
            
            # 2. Si no viene en los datos (ej: un PATCH parcial), lo sacamos del objeto
            if not order_type and self.detail:
                order_type = self.get_object().order_type

            if order_type == 'PREVENTIVE':
                return PreventiveMaintenanceOrderSerializer
            elif order_type == 'CORRECTIVE':
                return CorrectiveMaintenanceOrderSerializer
                
        return MaintenanceOrderSerializer