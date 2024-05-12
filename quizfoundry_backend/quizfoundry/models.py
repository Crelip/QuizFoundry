from django.db import models

# Create your models here.

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

class CorrectAnswers(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    correctAnswer = models.CharField(max_length=100)
    def __str__(self):
        return str(self.question.id) + " " + self.correctAnswer
    
class ChoiceAnswers(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choiceAnswer = models.CharField(max_length=100)
    def __str__(self):
        return str(self.question.id) + " " + self.choiceAnswer


class NextQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='current_question')
    answer = models.CharField(max_length=100)
    nextQuestion = models.ForeignKey(Question, related_name='next_question', on_delete=models.CASCADE)

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