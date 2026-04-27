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

    def create(self, validated_data):
        """Lógica de creación: Decide en qué tabla hija insertar los datos"""
        order_type = validated_data.get('order_type')

        if order_type == 'PREVENTIVE':
            # Extraemos los campos específicos antes de crear
            child_data = {
                'scheduled_km': validated_data.pop('scheduled_km', 0),
                'service_type': validated_data.pop('service_type', '')
            }
            # Creamos directamente en la tabla hija
            return PreventiveMaintenanceOrder.objects.create(**validated_data, **child_data)

        elif order_type == 'CORRECTIVE':
            child_data = {
                'incident': validated_data.pop('incident', None)
            }
            return CorrectiveMaintenanceOrder.objects.create(**validated_data, **child_data)

        return super().create(validated_data)
      
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class MileageNotificationSerializer(serializers.ModelSerializer):
    vehicle_placa = serializers.ReadOnlyField(source='preventive_order.vehicle.placa')
    service_type = serializers.ReadOnlyField(source='preventive_order.service_type')

    class Meta:
        model = MileageNotification
        fields = ['id', 'message', 'notif_type', 'is_read', 'created_at', 'vehicle_placa', 'service_type']

class NotificationSerializer(serializers.ModelSerializer):
    notif_type_display = serializers.CharField(source='get_notif_type_display', read_only=True)

    def to_representation(self, instance):
        if instance.notif_type == 'MILEAGE' and hasattr(instance, 'mileagenotification'):
            return MileageNotificationSerializer(instance.mileagenotification, context=self.context).data
        
        return super().to_representation(instance)
    
    class Meta:
        model = Notification
        fields = '__all__'
