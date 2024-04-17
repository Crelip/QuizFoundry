from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    def __str__(self):
        return self.username

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    quizName = models.CharField(max_length=100, unique=True)
    quizOwner = models.PositiveIntegerField()
    dateCreated = models.DateTimeField(auto_now_add=True)
    firstQuestion = models.PositiveIntegerField()
    def questions(self):
        return Question.objects.filter(quizID = self.id)
    def __str__(self):
        return self.quizName

class ChoiceAnswers(models.Model):
    questionID = models.PositiveIntegerField()
    choiceAnswer = models.CharField(max_length=100)
    def __str__(self):
        return str(self.questionID) + " " + self.choiceAnswer

class CorrectAnswers(models.Model):
    questionID = models.PositiveIntegerField()
    correctAnswer = models.CharField(max_length=100)
    def __str__(self):
        return str(self.questionID) + " " + self.correctAnswer

class NextQuestion(models.Model):
    questionID = models.PositiveIntegerField()
    answer = models.CharField(max_length=100)
    nextQuestionID = models.PositiveIntegerField()
    def __str__(self):
        return str(self.questionID) + " " + self.answer + " " + str(self.nextQuestionID)


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    quizID = models.PositiveIntegerField()
    questionText = models.CharField(max_length=300)
    isChoice = models.BooleanField()
    multimedia = models.BinaryField()
    dynamicNext = models.BooleanField()
    def choices(self):
        return ChoiceAnswers.objects.filter(questionID = self.id)
    def __str__(self):
        return self.questionText

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