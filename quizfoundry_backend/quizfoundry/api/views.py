from rest_framework.viewsets import ModelViewSet, generics
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import F
from ..models import Quiz, Question, ChoiceAnswers, CorrectAnswers, NextQuestion, Answer, AnswerQuestion
from .serializers import QuizSerializer, QuestionSerializer, ChoiceAnswersSerializer, CorrectAnswersSerializer, NextQuestionSerializer, UserRegistrationSerializer, AnswerSerializer, AnswerQuestionSerializer

class QuizViewSet(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


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
        questionID = self.kwargs['questionID']
        return ChoiceAnswers.objects.filter(question_id=questionID)

class CorrectAnswersListView(ListAPIView):
    serializer_class = CorrectAnswersSerializer

    def get_queryset(self):
        questionID = self.kwargs['questionID']
        return CorrectAnswers.objects.filter(question_id=questionID)

class NextQuestionListView(ListAPIView):
    serializer_class = NextQuestionSerializer

    def get_queryset(self):
        questionID = self.kwargs['questionID']
        return NextQuestion.objects.filter(question_id=questionID)
    
class UserHistoryListView(ListAPIView):
    serializer_class = AnswerSerializer

    def get_queryset(self):
        user_id = self.kwargs['userID']
        return Answer.objects.filter(userID=user_id).order_by('-timeSubmitted')
    
class AnswerQuestionListView(ListAPIView):
    serializer_class = AnswerQuestionSerializer

    def get_queryset(self):
        answer_id = self.kwargs['answerID']
        return AnswerQuestion.objects.filter(answerID=answer_id)
    
class CreateQuizView(CreateAPIView):
    serializer_class = QuizSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            quiz = serializer.save()
            return Response({'id': quiz.id}, status=201)
        return Response(serializer.errors, status=400)
    
class AddQuestionView(CreateAPIView):
    serializer_class = QuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            question = serializer.save()
            return Response({'id': question.id}, status=201)
        return Response(serializer.errors, status=400)
    
class RemoveQuestionView(DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = 'id'
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
    
class AddCorrectAnswerView(CreateAPIView):
    serializer_class = CorrectAnswersSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=201)
        return Response(serializer.errors, status=400)
    
class AddChoiceAnswerView(CreateAPIView):
    serializer_class = ChoiceAnswersSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=201)
        return Response(serializer.errors, status=400)
    
class AddNextQuestionView(CreateAPIView):
    serializer_class = NextQuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=201)
        return Response(serializer.errors, status=400)
    
class UpdateFirstQuestionOfAQuizView(APIView):
    def post(self, request):
        try:
            quiz_id = request.data.get('id')
            first_question = request.data.get('firstQuestion')
            quiz_instance = Quiz.objects.get(id=quiz_id)
            quiz_instance.firstQuestion = first_question
            quiz_instance.save()
            serializer = QuizSerializer(quiz_instance)
            return Response(serializer.data, status=200)
        except Quiz.DoesNotExist:
            return Response({"message": "Quiz not found"}, status=404)
        except Exception as e:
            return Response({"message": str(e)}, status=400)

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)
    
class AddAnswerView(CreateAPIView):
    serializer_class = AnswerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            answer = serializer.save()
            return Response({'id': answer.id}, status=201)
        return Response(serializer.errors, status=400)
    
class AddAnswerQuestionView(CreateAPIView):
    serializer_class = AnswerQuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=201)
        return Response(serializer.errors, status=400)

