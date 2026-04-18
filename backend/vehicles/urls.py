from django.urls import path, include
from rest_framework import routers
from .views import VehicleViewSet
from .views import OdometerViewSet

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, 'vehicles')
router.register(r'odometer', OdometerViewSet, 'odometer')

urlpatterns = [
    path('api/v1/', include(router.urls))
]