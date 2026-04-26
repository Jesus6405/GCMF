from django.apps import AppConfig

class VehiclesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vehicles'

    def ready(self):
        # Importamos las señales para que Django las registre al iniciar
        import vehicles.signals