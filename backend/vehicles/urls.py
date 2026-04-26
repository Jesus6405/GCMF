from django.urls import path, include
from rest_framework import routers
from .views import (
    VehicleViewSet, 
    OdometerViewSet, 
    IncidentViewSet, 
    MaintenanceOrderViewSet, PreventiveMaintenanceOrderViewSet, CorrectiveMaintenanceOrderViewSet,
    NotificationViewSet, MileageNotificationViewSet
)

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, 'vehicles')
router.register(r'odometer', OdometerViewSet, 'odometer')
router.register(r'incidents', IncidentViewSet, 'incidents')
router.register(r'maintenanceOrders', MaintenanceOrderViewSet, 'maintenanceOrders')
router.register(r'preventiveMaintenance', PreventiveMaintenanceOrderViewSet, 'preventiveMaintenance')
router.register(r'correctiveMaintenance', CorrectiveMaintenanceOrderViewSet, 'correctiveMaintenance')
router.register(r'notifications', NotificationViewSet, 'notifications')
router.register(r'mileageNotifications', MileageNotificationViewSet, 'mileageNotifications')

urlpatterns = [
    path('api/v1/', include(router.urls))
]