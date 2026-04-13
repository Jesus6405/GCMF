from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from .models import Usuario
from .serializers import RegistroSerializer
from .permissions import IsAdminOrGerente

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminOrGerente]

    def create(self, request, *args, **kwargs):
        user_rol = request.user.rol
        target_rol = request.data.get('rol')

        # Lógica de restricción jerárquica
        if user_rol == 'ADMINISTRADOR_OPERATIVO':
            if target_rol in ['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']:
                return Response(
                    {"detail": "No tienes permisos para crear usuarios con este nivel de rango."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        return super().create(request, *args, **kwargs)
