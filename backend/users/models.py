from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UsuarioManager

class Usuario(AbstractBaseUser, PermissionsMixin):
    class EnumRol(models.TextChoices):
        GERENTE_FLOTA = 'GERENTE_FLOTA', 'Gerente de Flota'
        ADMINISTRADOR_OPERATIVO = 'ADMINISTRADOR_OPERATIVO', 'Administrador Operativo'
        CONDUCTOR = 'CONDUCTOR', 'Conductor'
        MECANICO = 'MECANICO', 'Mecánico'

    email = models.EmailField(unique=True, max_length=255)
    nombre = models.CharField(max_length=255)
    rol = models.CharField(max_length=30, choices=EnumRol.choices)
    
    # Campos requeridos por Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) 

    objects = UsuarioManager()

    # Esto le dice a Django que el email es el campo principal para el login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return f"{self.email} - {self.get_rol_display()}"
