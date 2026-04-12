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
    
    # brand: Manufacturer, Required
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