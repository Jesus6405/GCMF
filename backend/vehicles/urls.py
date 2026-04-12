from django.urls import path, include
from rest_framework import routers
from .views import VehicleViewSet

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, 'vehicles')

urlpatterns = [
    path('api/v1/', include(router.urls))
]