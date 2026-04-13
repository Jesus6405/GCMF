from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos datos personalizados al payload del token
        token['nombre'] = user.nombre
        token['rol'] = user.rol
        token['email'] = user.email

        return token
    

from .models import Usuario

class RegistroSerializer(serializers.ModelSerializer):
    
    rol = serializers.ChoiceField(choices=Usuario.EnumRol.choices)
    
    class Meta:
        model = Usuario
        fields = ['email', 'nombre', 'rol', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Usamos nuestro manager para que la contraseña se guarde con hash
        return Usuario.objects.create_user(**validated_data)