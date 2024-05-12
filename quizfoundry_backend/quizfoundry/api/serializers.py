from rest_framework.serializers import ModelSerializer
from ..models import Quiz, Question, ChoiceAnswers, CorrectAnswers, NextQuestion, Answer, AnswerQuestion
from django.contrib.auth.models import User
from rest_framework import serializers

class QuizSerializer(ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

class ChoiceAnswersSerializer(ModelSerializer):
    class Meta:
        model = ChoiceAnswers
        fields = '__all__'

class CorrectAnswersSerializer(ModelSerializer):
    class Meta:
        model = CorrectAnswers
        fields = '__all__'

class NextQuestionSerializer(ModelSerializer):
    class Meta:
        model = NextQuestion
        fields = '__all__'

class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class UserRegistrationSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class AnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class AnswerQuestionSerializer(ModelSerializer):
    class Meta:
        model = AnswerQuestion
        fields = '__all__'