from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, UserViewSet

quiz_router = DefaultRouter()
quiz_router.register(r'quiz', QuizViewSet)

user_router = DefaultRouter()
user_router.register(r'user', UserViewSet)