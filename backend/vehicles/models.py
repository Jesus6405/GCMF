from django.db import models

# Create your models here.
class Vehicle(models.Model):
    # Fuel type options
    class FuelType(models.TextChoices):
        GASOLINE = 'Gasoline', 'Gasolina'
        DIESEL = 'Diesel', 'Diésel'
        GAS = 'Gas', 'Gas'

    # Operational status options
    class OperationalStatus(models.TextChoices):
        OPERATIONAL = 'Operational', 'Operativo'
        IN_WORKSHOP = 'In Workshop', 'En Taller'
        UNDER_REVIEW = 'Under Review', 'Bajo Revisión'
        UNFIT = 'Unfit', 'No Apto'

    # placa: Unique identifier, Primary Key, Not null
    placa = models.CharField(
        max_length=20, 
        primary_key=True, 
        unique=True, 
        help_text="Unique identifier for the vehicle"
    )
    
    # brand: Manufacturer, Required (Equivalent to 'marca')
    brand = models.CharField(max_length=100)
    
    # model: Specific line or model, Required
    model = models.CharField(max_length=100)
    
    # year: Manufacturing year, Required
    year = models.IntegerField()
    
    # fuel_type: Defined by catalog (Enum)
    fuel_type = models.CharField(
        max_length=20,
        choices=FuelType.choices,
        help_text="Energy source type"
    )
    
    # vehicle_photo: Multimedia (Image)
    # vehicle_photo = models.ImageField(
    #     upload_to='vehicles/', 
    #     null=True, 
    #     blank=True,
    #     help_text="Physical image of the unit"
    # )
    
    # operational_status: Enum, changes based on incidents
    operational_status = models.CharField(
        max_length=30,
        choices=OperationalStatus.choices,
        default=OperationalStatus.OPERATIONAL
    )
    
    # current_km: Float, updated via Mileage Log
    current_km = models.FloatField(
        default=0.0,
        help_text="Last total recorded mileage"
    )

    def __str__(self):
        return f"{self.placa} - {self.brand} {self.model}"
    
class OdometerLog(models.Model):
    #Llave Foránea (Foreign Key) conectada a la placa del vehículo
    vehicle = models.ForeignKey(
        Vehicle, 
        on_delete=models.CASCADE, 
        related_name='odometer_logs',
        help_text="Vehículo al que pertenece este registro"
    )
    
    #El kilometraje reportado en ese momento
    km_reading = models.FloatField(
        help_text="Kilometraje registrado en el reporte"
    )
    
    #Fecha y hora en la que se realizó el registro (se llena automáticamente)
    recorded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora exacta del reporte"
    )

    #Descripcion del registro
    description = models.CharField(
        null= True,
        blank= True,
        max_length=300
        )

    class Meta:
        # Ordenamos los registros por fecha de forma descendente 
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.vehicle.placa} - {self.km_reading} km ({self.recorded_at.strftime('%d/%m/%Y')})"
    
class Incident(models.Model):
    class UrgencyLevel(models.TextChoices):
        LOW = 'Low', 'Leve'
        MODERATE = 'Moderate', 'Moderada'
        CRITICAL = 'Critical', 'Crítica'

    class ReportStatus(models.TextChoices):
        PENDING = 'Pending', 'Pendiente'
        UNDER_REVIEW = 'Under Review', 'En Revisión'
        RESOLVED = 'Resolved', 'Solucionado'

    vehicle = models.ForeignKey(
        Vehicle, 
        on_delete=models.CASCADE, 
        related_name='incidents',
        help_text="Vehículo asociado a la falla"
    )
    description = models.TextField(
        help_text="Descripción detallada de la falla o incidente"
    )
    urgency_level = models.CharField(
        max_length=20,
        choices=UrgencyLevel.choices,
        default=UrgencyLevel.LOW
    )
    report_status = models.CharField(
        max_length=20,
        choices=ReportStatus.choices,
        default=ReportStatus.PENDING
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de creación del reporte"
    )

    def save(self, *args, **kwargs):
        """
        Sobrescribimos el método save para aplicar la regla de negocio:
        Si la incidencia es Crítica, el vehículo queda fuera de servicio.
        """
        if self.urgency_level == self.UrgencyLevel.CRITICAL:
            # Accedemos al objeto vehículo relacionado
            self.vehicle.operational_status = 'Unfit'
            # Guardamos el cambio solo en el vehículo
            self.vehicle.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Incidencia {self.id} - {self.vehicle.placa} ({self.urgency_level})"

class MaintenanceOrder(models.Model):
    # Opciones de tipo de mantenimiento
    class OrderType(models.TextChoices):
        PREVENTIVE = 'PREVENTIVE', 'Preventivo'
        CORRECTIVE = 'CORRECTIVE', 'Correctivo'

    # NUEVO: Opciones de estado para el ciclo de vida de la orden
    class OrderStatus(models.TextChoices):
        PLANNING = 'PLANNING', 'Planificación'
        EXECUTION = 'EXECUTION', 'Ejecución'
        CLOSURE = 'CLOSURE', 'Cierre'
        CANCELLED = 'CANCELLED', 'Cancelada'

    id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='maintenances')
    
    order_type = models.CharField(
        max_length=20,
        choices=OrderType.choices,
        default=OrderType.PREVENTIVE
    )

    # El estado actual de la orden
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PLANNING,
        verbose_name="estadoActual"
    )
    
    # --- FASE 1: PLANIFICACIÓN (Llenado por Administrador Operativo) ---
    start_date = models.DateTimeField(verbose_name="fechaInicio")
    estimated_budget = models.FloatField(default=0.0, verbose_name="presupuestoEstimado")
    
    # --- FASE 2: EJECUCIÓN (Llenado por el Mecánico) ---
    man_hours = models.FloatField(default=0.0, verbose_name="horasHombre")
    mechanic_observations = models.TextField(null=True, blank=True, verbose_name="observacionesTecnicas")
    
    # --- FASE 3: CIERRE (Llenado/Validado por Administrador/Gerente) ---
    end_date = models.DateTimeField(null=True, blank=True, verbose_name="fechaFin")
    final_odometer = models.FloatField(null=True, blank=True, verbose_name="odometroCierre")
    total_cost = models.FloatField(default=0.0, verbose_name="costoTotalReal")

    def __str__(self):
        return f"{self.get_order_type_display()} - {self.id} ({self.vehicle.placa}) - {self.get_status_display()}"

# Clase Especializada: Preventivo 
class PreventiveMaintenanceOrder(MaintenanceOrder):
    scheduled_km = models.FloatField(verbose_name="kmProgramado")
    service_type = models.CharField(
        max_length=100, 
        verbose_name="tipoServicio"
    )

# Clase Especializada: Correctivo 
class CorrectiveMaintenanceOrder(MaintenanceOrder):
    incident = models.OneToOneField(
        'Incident', 
        on_delete=models.CASCADE, 
        related_name='correction',
        help_text="Vinculada a la orden de mantenimiento correctiva"
    )