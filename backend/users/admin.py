from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class CustomUserAdmin(UserAdmin):
    # Configuramos cómo se verá en el listado del admin
    list_display = ('email', 'nombre', 'rol', 'is_staff')
    list_filter = ('rol', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    search_fields = ('email', 'nombre')
    ordering = ('email',)

admin.site.register(Usuario, CustomUserAdmin)