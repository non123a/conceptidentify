from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate

# from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
)
class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(
                username=username,
                password=password
            )

            if user is None:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid credentials"
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            if (
                user.role == "lecturer"
                and not user.is_approved
            ):
                return Response(
                    {
                        "success": False,
                        "message": "Lecturer not approved yet."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            refresh = RefreshToken.for_user(user)

            response = Response({
                "success": True,
                "message": "Login successful",
                "data": {
                    "user": UserSerializer(user).data
                }
            })

            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax'
            )
            
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax'
            )
            
            return response

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    def post(self, request):
        response = Response({"success": True, "message": "Successfully logged out"})
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response

class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response({
            "success": True,
            "data": serializer.data
        })
    

class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Account created. "
                        "Waiting for approval."
                        if user.role == "lecturer"
                        else
                        "Account created successfully."
                    )
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )