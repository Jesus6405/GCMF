from django.urls import path, include
from rest_framework import routers
from .views import VehicleViewSet
from .views import OdometerViewSet
from .views import IncidentViewSet

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, 'vehicles')
router.register(r'odometer', OdometerViewSet, 'odometer')
router.register(r'incidents', IncidentViewSet, 'incidents')

urlpatterns = [
    path('api/v1/', include(router.urls))
]