from django.apps import AppConfig


class VehiclesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vehicles'

class OdometerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'odometer'

class IncidentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'incidents'
