from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if username and password:
        try:
            user = User.objects.create_user(username=username, password=password)

            if (user != None):
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({'access': access_token, 'refresh': str(refresh)}, status=status.HTTP_201_CREATED)

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)