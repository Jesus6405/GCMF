from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OdometerLog, MaintenanceOrder, PreventiveMaintenanceOrder, MileageNotification

@receiver(post_save, sender=OdometerLog)
def check_maintenance_alerts(sender, instance, created, **kwargs):
    if created:
        print(f"\n--- DEBUG START ---")
        print(f"1. Procesando log para: {instance.vehicle.placa} ({instance.km_reading} km)")
        
        vehicle = instance.vehicle
        # Actualizamos el km del vehículo de una vez
        vehicle.current_km = instance.km_reading
        vehicle.save()

        # Diagnóstico: ¿Existen órdenes de cualquier tipo para este vehículo?
        all_orders = MaintenanceOrder.objects.filter(vehicle=vehicle).count()
        print(f"2. Órdenes totales encontradas para este vehículo: {all_orders}")

        # Intentamos buscar por el campo order_type que definimos antes, 
        # esto es más seguro que buscar directamente en la clase hija
        active_preventives = PreventiveMaintenanceOrder.objects.filter(vehicle=vehicle)
        print(f"3. Órdenes preventivas específicas encontradas: {active_preventives.count()}")

        threshold = 500 
        
        for order in active_preventives:
            km_to_service = order.scheduled_km - instance.km_reading
            print(f"4. Analizando Orden #{order.id}: Faltan {km_to_service} km")

            if 0 <= km_to_service <= threshold:
                # Verificar duplicados
                if not MileageNotification.objects.filter(preventive_order=order, is_read=False).exists():
                    MileageNotification.objects.create(
                        message=f"Alerta: {vehicle.placa} a {km_to_service} km de mantenimiento.",
                        notif_type='MILEAGE',
                        preventive_order=order
                    )
                    print("5. ¡NOTIFICACIÓN CREADA!")
                else:
                    print("5. Notificación omitida (ya existe una activa)")
        
        print(f"--- DEBUG END ---\n")