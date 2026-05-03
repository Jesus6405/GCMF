#from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from .serializer import (
    VehicleSerializer, OdometerLogSerializer, IncidentSerializer,
    MaintenanceOrderSerializer, PreventiveMaintenanceOrderSerializer, CorrectiveMaintenanceOrderSerializer,
    NotificationSerializer, MileageNotificationSerializer, DocumentSerializer
)
from .models import (
    Vehicle, 
    OdometerLog, 
    Incident, 
    MaintenanceOrder, PreventiveMaintenanceOrder, CorrectiveMaintenanceOrder,
    Notification, MileageNotification, Document
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

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class MileageNotificationViewSet(viewsets.ModelViewSet):
    queryset = MileageNotification.objects.all()
    serializer_class = MileageNotificationSerializer

@api_view(['GET'])
def dashboard_stats(request):
    # Estadísticas generales
    total_vehicles = Vehicle.objects.count()
    vehicles_by_status = Vehicle.objects.values('operational_status').annotate(count=Count('operational_status'))
    
    total_incidents = Incident.objects.count()
    incidents_by_urgency = Incident.objects.values('urgency_level').annotate(count=Count('urgency_level'))
    incidents_by_status = Incident.objects.values('report_status').annotate(count=Count('report_status'))
    
    total_maintenance_orders = MaintenanceOrder.objects.count()
    maintenance_by_type = MaintenanceOrder.objects.values('order_type').annotate(count=Count('order_type'))
    maintenance_by_status = MaintenanceOrder.objects.values('status').annotate(count=Count('status'))
    total_maintenance_cost = MaintenanceOrder.objects.aggregate(total=Sum('total_cost'))['total'] or 0
    
    total_odometer_logs = OdometerLog.objects.count()
    total_km = OdometerLog.objects.aggregate(total=Sum('km_reading'))['total'] or 0
    
    # Cálculo simplificado de TCO (Total Cost of Ownership)
    # Asumiendo que TCO incluye costos de mantenimiento + estimación de otros costos
    # Para un cálculo real, necesitaríamos más campos como costo de adquisición, combustible, etc.
    # Aquí, TCO por vehículo = costo mantenimiento / número de vehículos + otros factores
    avg_maintenance_cost_per_vehicle = total_maintenance_cost / total_vehicles if total_vehicles > 0 else 0
    # Estimación básica: agregar un factor para otros costos (ej. 20% adicional)
    estimated_other_costs = total_maintenance_cost * 0.2
    total_tco = total_maintenance_cost + estimated_other_costs
    
    data = {
        'vehicles': {
            'total': total_vehicles,
            'by_status': list(vehicles_by_status)
        },
        'incidents': {
            'total': total_incidents,
            'by_urgency': list(incidents_by_urgency),
            'by_status': list(incidents_by_status)
        },
        'maintenance': {
            'total_orders': total_maintenance_orders,
            'by_type': list(maintenance_by_type),
            'by_status': list(maintenance_by_status),
            'total_cost': total_maintenance_cost
        },
        'odometer': {
            'total_logs': total_odometer_logs,
            'total_km': total_km
        },
        'tco': {
            'total_tco': total_tco,
            'avg_cost_per_vehicle': avg_maintenance_cost_per_vehicle,
            'maintenance_cost': total_maintenance_cost,
            'estimated_other_costs': estimated_other_costs
        }
    }
    return Response(data)
