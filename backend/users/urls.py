from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'gestion', UsuarioViewSet, basename='usuarios')

urlpatterns = [
    # Login: Recibe email/password -> Devuelve Access y Refresh
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refresh: Recibe el Refresh Token -> Devuelve un nuevo Access Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Esto crea todas las rutas CRUD
    path('', include(router.urls)), 
]