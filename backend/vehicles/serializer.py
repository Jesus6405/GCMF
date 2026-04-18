from rest_framework import serializers
from .models import Vehicle
from .models import OdometerLog

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