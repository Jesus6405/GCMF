from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Usuario
from .serializers import RegistroSerializer
from .permissions import IsAdminOrGerente

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminOrGerente] # Regla base

    def create(self, request, *args, **kwargs):
        # Lógica de restricción jerárquica
        user_rol = request.user.rol
        target_rol = request.data.get('rol')
        if user_rol == 'ADMINISTRADOR_OPERATIVO' and target_rol not in ['CONDUCTOR', 'MECANICO']:
            return Response({"detail": "No puedes crear rangos superiores."}, status=403)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Evitamos que un Admin edite a un Gerente
        usuario_a_editar = self.get_object()
        if request.user.rol == 'ADMINISTRADOR_OPERATIVO' and usuario_a_editar.rol == 'GERENTE_FLOTA':
            return Response({"detail": "No puedes editar a un Gerente."}, status=403)
        return super().update(request, *args, **kwargs)
