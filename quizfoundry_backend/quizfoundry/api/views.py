from rest_framework.viewsets import ModelViewSet, generics
from rest_framework.generics import ListAPIView
from ..models import User, Quiz, Question, ChoiceAnswers, CorrectAnswers, NextQuestion
from .serializers import QuizSerializer, UserSerializer, QuestionSerializer, ChoiceAnswersSerializer, CorrectAnswersSerializer, NextQuestionSerializer

class QuizViewSet(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'id'

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = 'id'

class ChoiceAnswersListView(ListAPIView):
    serializer_class = ChoiceAnswersSerializer

    def get_queryset(self):
        question_id = self.kwargs['questionID']
        return ChoiceAnswers.objects.filter(questionID=question_id)

class CorrectAnswersListView(ListAPIView):
    serializer_class = CorrectAnswersSerializer

    def get_queryset(self):
        question_id = self.kwargs['questionID']
        return CorrectAnswers.objects.filter(questionID=question_id)

class NextQuestionListView(ListAPIView):
    serializer_class = NextQuestionSerializer

    def get_queryset(self):
        question_id = self.kwargs['questionID']
        return NextQuestion.objects.filter(questionID=question_id)