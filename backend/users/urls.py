from django.urls import path
from .views import MyTokenObtainPairView, UsuarioCreateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Login: Recibe email/password -> Devuelve Access y Refresh
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Refresh: Recibe el Refresh Token -> Devuelve un nuevo Access Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registro/Creación (Protegido por roles)
    path('crear/', UsuarioCreateView.as_view(), name='crear_usuario'),
]