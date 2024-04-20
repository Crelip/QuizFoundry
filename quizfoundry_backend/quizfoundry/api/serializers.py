from rest_framework.serializers import ModelSerializer
from ..models import User, Quiz, Question, ChoiceAnswers, CorrectAnswers, NextQuestion

class QuizSerializer(ModelSerializer):
    class Meta:
        model = Quiz
        fields = ('id', 'quizName', 'quizOwner', 'dateCreated', 'firstQuestion')

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

class ChoiceAnswersSerializer(ModelSerializer):
    class Meta:
        model = ChoiceAnswers
        fields = ('questionID', 'choiceAnswer')

class CorrectAnswersSerializer(ModelSerializer):
    class Meta:
        model = CorrectAnswers
        fields = '__all__'

class NextQuestionSerializer(ModelSerializer):
    class Meta:
        model = NextQuestion
        fields = ('questionID', 'answer', 'nextQuestionID')

class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'