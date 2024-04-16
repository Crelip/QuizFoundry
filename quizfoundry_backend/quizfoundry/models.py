from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

class Quiz(models.Model):
    quizName = models.CharField(max_length=100)
    quizOwner = models.PositiveIntegerField()
    dateCreated = models.DateTimeField(auto_now_add=True)
    firstQuestion = models.PositiveIntegerField()

class Question(models.Model):
    quizID = models.PositiveIntegerField()
    questionText = models.CharField(max_length=300)
    isChoice = models.BooleanField()
    multimedia = models.BinaryField()
    dynamicNext = models.BooleanField()

class ChoiceAnswers(models.Model):
    questionID = models.PositiveIntegerField()
    choiceAnswer = models.CharField(max_length=100)

class CorrectAnswers(models.Model):
    questionID = models.PositiveIntegerField()
    correctAnswer = models.CharField(max_length=100)

class NextQuestion(models.Model):
    questionID = models.PositiveIntegerField()
    answer = models.CharField(max_length=100)
    nextQuestionID = models.PositiveIntegerField()

class Answer(models.Model):
    quizID = models.PositiveIntegerField()
    userID = models.IntegerField()
    timeSubmitted = models.DateTimeField(auto_now_add=True)
    correctAnswers = models.PositiveIntegerField()
    totalQuestions = models.PositiveIntegerField()

class AnswerQuestion(models.Model):
    answerID = models.PositiveIntegerField()
    questionID = models.PositiveIntegerField()
    answer = models.CharField(max_length=100)
    isCorrect = models.BooleanField()