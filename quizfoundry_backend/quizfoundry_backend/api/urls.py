from rest_framework.routers import DefaultRouter
from quizfoundry.api.urls import quiz_router, user_router
from django.urls import path, include

router = DefaultRouter()
# Quizzes test
router.registry.extend(quiz_router.registry)
router.registry.extend(user_router.registry)

urlpatterns = [
    path('', include(router.urls))
]