from django.contrib.auth.models import BaseUserManager

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, rol, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, rol=rol, **extra_fields)
        # set_password aplica el hash a la contraseña automáticamente
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        extra_fields.pop('rol', None)

        # El superusuario de Django actuará lógicamente como el Gerente principal
        return self.create_user(email, nombre, 'GERENTE_FLOTA', password, **extra_fields)