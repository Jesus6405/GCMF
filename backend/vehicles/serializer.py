from rest_framework import serializers
from .models import (
    Vehicle, OdometerLog, Incident, 
    MaintenanceOrder, PreventiveMaintenanceOrder, CorrectiveMaintenanceOrder, Document
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

class MaintenanceOrderSerializer(serializers.ModelSerializer):
    # Añadimos un campo para ver el nombre legible del tipo si queremos
    order_type_display = serializers.CharField(source='get_order_type_display', read_only=True)

    def to_representation(self, instance):
        # Usamos el campo explícito para decidir qué serializador usar
        if instance.order_type == 'PREVENTIVE' and hasattr(instance, 'preventivemaintenanceorder'):
            return PreventiveMaintenanceOrderSerializer(instance.preventivemaintenanceorder, context=self.context).data
        
        if instance.order_type == 'CORRECTIVE' and hasattr(instance, 'correctivemaintenanceorder'):
            return CorrectiveMaintenanceOrderSerializer(instance.correctivemaintenanceorder, context=self.context).data
        
        return super().to_representation(instance)

    class Meta:
        model = MaintenanceOrder
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'