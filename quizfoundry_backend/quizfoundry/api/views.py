from rest_framework.viewsets import ModelViewSet
from ..models import User, Quiz, Question
from .serializers import QuizSerializer, UserSerializer

class QuizViewSet(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer