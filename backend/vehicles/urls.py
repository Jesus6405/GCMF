from django.urls import path, include
from rest_framework import routers
from .views import (
    VehicleViewSet, 
    OdometerViewSet, 
    IncidentViewSet, 
    MaintenanceOrderViewSet,
    NotificationViewSet, 
    MileageNotificationViewSet, 
    DocumentViewSet
)
from django.conf import settings 
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, 'vehicles')
router.register(r'odometer', OdometerViewSet, 'odometer')
router.register(r'incidents', IncidentViewSet, 'incidents')
router.register(r'maintenanceOrders', MaintenanceOrderViewSet, 'maintenanceOrders')
router.register(r'notifications', NotificationViewSet, 'notifications')
router.register(r'mileageNotifications', MileageNotificationViewSet, 'mileageNotifications')
router.register(r'documents', DocumentViewSet, 'documents')

urlpatterns = [
    path('api/v1/', include(router.urls))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)