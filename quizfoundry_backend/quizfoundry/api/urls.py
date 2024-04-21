from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet
quiz_router = DefaultRouter()
quiz_router.register(r'quiz', QuizViewSet)