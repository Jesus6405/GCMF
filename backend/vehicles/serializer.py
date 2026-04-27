from rest_framework import serializers
from .models import (
    Vehicle, 
    OdometerLog, 
    Incident, 
    MaintenanceOrder, PreventiveMaintenanceOrder, CorrectiveMaintenanceOrder,
    Notification, MileageNotification, Document
)

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class OdometerLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OdometerLog
        fields = '__all__'

    def validate(self, data):
        vehiculo = data['vehicle']
        nuevo_km = data['km_reading']

        # Buscamos si el vehículo ya tiene un kilometraje actual
        if vehiculo.current_km >= nuevo_km:
            raise serializers.ValidationError({
                "km_reading": f"El kilometraje debe ser estrictamente mayor al actual ({vehiculo.current_km} km)."
            })
        
        return data
    
class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class PreventiveMaintenanceOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreventiveMaintenanceOrder
        fields = '__all__'

class CorrectiveMaintenanceOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectiveMaintenanceOrder
        fields = '__all__'

# Solo se usa para el LIST (GET)
class MaintenanceOrderSerializer(serializers.ModelSerializer):
    order_type_display = serializers.CharField(source='get_order_type_display', read_only=True)

    scheduled_km = serializers.FloatField(
        source='preventivemaintenanceorder.scheduled_km',
        read_only=True
    )

    service_type = serializers.CharField(
        source='preventivemaintenanceorder.service_type',
        read_only=True
    )

    incident = serializers.PrimaryKeyRelatedField(
        source='correctivemaintenanceorder.incident',
        read_only=True
    )

    class Meta:

        model = MaintenanceOrder

        fields = [
            'id', 'vehicle', 'order_type', 'order_type_display', 'status',
            'start_date', 'estimated_budget', 'man_hours',
            'mechanic_observations', 'end_date', 'final_odometer',
            'total_cost', 'scheduled_km', 'service_type', 'incident'
        ]

    def to_representation(self, instance):
        if instance.order_type == 'PREVENTIVE' and hasattr(instance, 'preventivemaintenanceorder'):
            return PreventiveMaintenanceOrderSerializer(instance.preventivemaintenanceorder, context=self.context).data
        if instance.order_type == 'CORRECTIVE' and hasattr(instance, 'correctivemaintenanceorder'):
            return CorrectiveMaintenanceOrderSerializer(instance.correctivemaintenanceorder, context=self.context).data
        
        return super().to_representation(instance)

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class MileageNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MileageNotification
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    notif_type_display = serializers.CharField(source='get_notif_type_display', read_only=True)

    def to_representation(self, instance):
        if instance.notif_type == 'MILEAGE' and hasattr(instance, 'mileagenotification'):
            return MileageNotificationSerializer(instance.mileagenotification, context=self.context).data
        
        return super().to_representation(instance)
