from os import path

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate

from users.models import User
import logging

logger = logging.getLogger(__name__)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)
# from .serializers import LoginSerializer, UserSerializer, RegisterSerializer
from .serializers import (
    LoginSerializer,
    UserSerializer,
    RegisterSerializer,
)
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
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

            is_production = not settings.DEBUG
            cookie_domain = ".conceptidentif.space" if is_production else None
            cookie_samesite = "None" if is_production else "Lax"
            cookie_secure = is_production

            logger.info(f"[Login Diagnostics] settings.DEBUG: {settings.DEBUG}, is_production: {is_production}")
            logger.info(f"[Login Diagnostics] Cookie params - domain: {cookie_domain}, samesite: {cookie_samesite}, secure: {cookie_secure}")

            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                domain=cookie_domain,
                path="/",   
            )
            
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                domain=cookie_domain,
                path="/",     
            )
            
            logger.info(f"[Login Diagnostics] Final Response headers: {response.headers}")
            return response

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        response = Response({"success": True, "message": "Successfully logged out"})
        
        is_production = not settings.DEBUG
        cookie_domain = ".conceptidentif.space" if is_production else None
        cookie_samesite = "None" if is_production else "Lax"
        
        response.delete_cookie('access', domain=cookie_domain, path="/", samesite=cookie_samesite)
        response.delete_cookie('refresh', domain=cookie_domain, path="/", samesite=cookie_samesite)
        
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
    authentication_classes = []
    permission_classes = [AllowAny]
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
    



class GoogleLoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        credential = request.data.get(
            "credential"
        )

        role = request.data.get(
            "role",
        )

        try:

            google_user = (
                id_token.verify_oauth2_token(
                    credential,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )
            )

            google_id = google_user["sub"]

            email = google_user["email"]

            first_name = (
                google_user.get(
                    "given_name",
                    ""
                )
            )

            last_name = (
                google_user.get(
                    "family_name",
                    ""
                )
            )
            user = User.objects.filter(
                google_id=google_id
            ).first()
            if not user:
                user = User.objects.filter(
                    email=email
                ).first()

                if user:

                    user.google_id = google_id
                    user.save()

            if user:

                if (
                    user.role == "lecturer"
                    and not user.is_approved
                ):
                    return Response(
                        {
                            "success": False,
                            "message":
                            "Lecturer not approved yet."
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )

                refresh = RefreshToken.for_user(
                    user
                )

                response = Response(
                    {
                        "success": True,
                        "message":
                        "Login successful",
                        "data": {
                            "user":
                            UserSerializer(user).data
                        }
                    }
                )

                is_production = not settings.DEBUG
                cookie_domain = ".conceptidentif.space" if is_production else None
                cookie_samesite = "None" if is_production else "Lax"
                cookie_secure = is_production

                logger.info(f"[GoogleLogin Diagnostics] settings.DEBUG: {settings.DEBUG}, is_production: {is_production}")
                logger.info(f"[GoogleLogin Diagnostics] Cookie params - domain: {cookie_domain}, samesite: {cookie_samesite}, secure: {cookie_secure}")

                response.set_cookie(
                    key="access",
                    value=str(
                        refresh.access_token
                    ),
                    httponly=True,
                    secure=cookie_secure,
                    samesite=cookie_samesite,
                    domain=cookie_domain,
                    path="/",   
                )

                response.set_cookie(
                    key="refresh",
                    value=str(refresh),
                    httponly=True,
                    secure=cookie_secure,
                    samesite=cookie_samesite,
                    domain=cookie_domain,
                    path="/",   
                )

                logger.info(f"[GoogleLogin Diagnostics] Final Response headers: {response.headers}")
                return response
            
            if not user:

                if not role:

                    return Response(
                        {
                            "success": False,
                            "message":
                            "Account not found. Please register first."
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )

                user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role=role,
                    google_id=google_id,
                )
            if user.role == "lecturer":

                user.is_approved = False
                user.save()

                return Response(
                    {
                        "success": True,
                        "pending": True,
                        "message":
                        "Lecturer account created. Waiting for approval."
                    }
                )
            user.is_approved = True

            user.save()

            refresh = RefreshToken.for_user(user)

            response = Response(
                {
                    "success": True,
                    "message":
                    "Google login successful",
                    "data": {
                        "user":
                        UserSerializer(user).data
                    }
                }
            )

            is_production = not settings.DEBUG
            cookie_domain = ".conceptidentif.space" if is_production else None
            cookie_samesite = "None" if is_production else "Lax"
            cookie_secure = is_production

            logger.info(f"[GoogleRegistration Diagnostics] settings.DEBUG: {settings.DEBUG}, is_production: {is_production}")
            logger.info(f"[GoogleRegistration Diagnostics] Cookie params - domain: {cookie_domain}, samesite: {cookie_samesite}, secure: {cookie_secure}")

            response.set_cookie(
                key="access",
                value=str(
                    refresh.access_token
                ),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                domain=cookie_domain,
                path="/",
            )

            response.set_cookie(
                key="refresh",
                value=str(refresh),
                httponly=True,
                secure=cookie_secure,
                samesite=cookie_samesite,
                domain=cookie_domain,
                path="/",
            )

            logger.info(f"[GoogleRegistration Diagnostics] Final Response headers: {response.headers}")
            return response
        except Exception as e:

            logger.error(
                f"Google Login Error: {str(e)}"
            )
            return Response(
                {
                    "success": False,
                    "message":
                    "Invalid Google token"
                },
                status=400
            )