
from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
        ]
        
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.ModelSerializer):

    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "password",
            "confirm_password",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate(self, data):

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        return data

    def create(self, validated_data):

        validated_data.pop(
            "confirm_password"
        )

        role = validated_data.get("role")

        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=role,
        )

        if role == "lecturer":
            user.is_approved = False
        else:
            user.is_approved = True

        user.set_password(
            validated_data["password"]
        )

        user.save()

        return user