from rest_framework.routers import DefaultRouter
from quizfoundry.api.urls import quiz_router
from django.urls import path, include
from quizfoundry.api.views import QuizDetailView, QuestionDetailView, ChoiceAnswersListView, CorrectAnswersListView, NextQuestionListView, CreateQuizView, AddQuestionView, AddCorrectAnswerView, AddChoiceAnswerView, AddNextQuestionView, UpdateFirstQuestionOfAQuizView, UserRegistrationView, AddAnswerView, AddAnswerQuestionView, UserHistoryListView, AnswerQuestionListView, RemoveQuestionView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

router = DefaultRouter()
# Quizzes test
router.registry.extend(quiz_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<int:id>/', QuizDetailView.as_view(), name='quiz_detail'),
    path('question/<int:id>/', QuestionDetailView.as_view(), name='question_detail'),
    path('choices/<int:questionID>/', ChoiceAnswersListView.as_view(), name='choices_list'),
    path('correct/<int:questionID>/', CorrectAnswersListView.as_view(), name='correct_detail'),
    path('next/<int:questionID>/', NextQuestionListView.as_view(), name='next_detail'),
    path('user_history/<int:userID>/', UserHistoryListView.as_view(), name='user_history'),
    path('answer_question/<int:answerID>/', AnswerQuestionListView.as_view(), name='answer_question'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create_quiz/', CreateQuizView.as_view(), name='create_quiz'),

    path('add_question/', AddQuestionView.as_view(), name='add_question'),
    path('add_correct_answer/', AddCorrectAnswerView.as_view(), name="add_correct_answer"),
    path('add_choice_answer/', AddChoiceAnswerView.as_view(), name="add_choice_answer"),
    path('add_next_question/', AddNextQuestionView.as_view(), name="add_next_question"),
    path('add_answer/', AddAnswerView.as_view(), name='add_answer'),
    path('add_answer_question/', AddAnswerQuestionView.as_view(), name='add_answer_question'),

    path('remove_question/<int:id>/', RemoveQuestionView.as_view(), name='remove_question'),

    path('update_first_question/', UpdateFirstQuestionOfAQuizView.as_view(), name='update_first_question'),
    path('register/', UserRegistrationView.as_view(), name='user_registration')
]