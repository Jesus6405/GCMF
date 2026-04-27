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

class PreventiveMaintenanceOrderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'preventiveMaintenance'

class CorrectiveMaintenanceOrderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'correctiveMaintenance'

class MaintenanceOrderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'maintenanceOrders'

class Document(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'document'
    
class NotificationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'

class MileageNotificationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mileageNotifications'
