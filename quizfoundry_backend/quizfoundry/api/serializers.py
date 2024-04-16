from rest_framework.serializers import ModelSerializer
from ..models import User, Quiz, Question

class QuizSerializer(ModelSerializer):
    class Meta:
        model = Quiz
        fields = ('id', 'quizName', 'quizOwner', 'dateCreated', 'firstQuestion')

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')