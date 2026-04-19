from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos datos personalizados al payload del token
        token['nombre'] = user.nombre
        token['rol'] = user.rol
        token['email'] = user.email

        return token
    

class RegistroSerializer(serializers.ModelSerializer):
    
    rol = serializers.ChoiceField(choices=Usuario.EnumRol.choices)
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'rol', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        # Usamos nuestro manager para que la contraseña se guarde con hash
        return Usuario.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
       # 1. Extraemos la contraseña si viene en los datos
        password = validated_data.pop('password', None)
        
        # 2. Actualizamos el resto de los campos (nombre, email, rol)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # 3. Si se envió una contraseña nueva, la encriptamos
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance
        