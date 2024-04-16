from django.urls import path
from . import views

appName = 'quizfoundry'

urlpatterns = [
    path('', views.index, name='index'),
]