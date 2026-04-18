from rest_framework import permissions

class IsGerente(permissions.BasePermission):
    """Permiso exclusivo para el Gerente de Flota"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'GERENTE_FLOTA'

class IsAdminOrGerente(permissions.BasePermission):
    """Permiso para Gerentes y Administradores Operativos"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol in ['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO']