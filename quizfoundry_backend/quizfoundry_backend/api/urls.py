from rest_framework.routers import DefaultRouter
from quizfoundry.api.urls import quiz_router, user_router
from django.urls import path, include
from quizfoundry.api.views import QuizDetailView, QuestionDetailView, ChoiceAnswersListView, CorrectAnswersListView, NextQuestionListView

router = DefaultRouter()
# Quizzes test
router.registry.extend(quiz_router.registry)
router.registry.extend(user_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<int:id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('question/<int:id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('choices/<int:questionID>/', ChoiceAnswersListView.as_view(), name='choices-list'),
    path('correct/<int:questionID>/', CorrectAnswersListView.as_view(), name='correct-detail'),
    path('next/<int:questionID>/', NextQuestionListView.as_view(), name='next-detail'),
]