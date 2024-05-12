from django.contrib import admin
from .models import Quiz, Question, ChoiceAnswers, CorrectAnswers, NextQuestion, Answer, AnswerQuestion

# Register your models here.

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(ChoiceAnswers)
admin.site.register(CorrectAnswers)
admin.site.register(NextQuestion)
admin.site.register(Answer)
admin.site.register(AnswerQuestion)