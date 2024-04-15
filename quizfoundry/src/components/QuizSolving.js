import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function QuizSolving({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answeredQuestionsAmount, setAnsweredQuestionsAmount] = useState(0);
  const [correctAnswersAmount, setCorrectAnswersAmount] = useState(0);

  const handleAnswer = (answer, question) => {
    setAnsweredQuestionsAmount(answeredQuestionsAmount + 1);
    if(question.correctAnswers.includes(answer)) setCorrectAnswersAmount(correctAnswersAmount + 1);
    const updatedUserAnswers = [...userAnswers, answer];
    setUserAnswers(updatedUserAnswers);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.dynamicNext) {
      const nextIndex = currentQuestion.nextQuestion(answer);
      setCurrentQuestionIndex(nextIndex);
    } else {
      setCurrentQuestionIndex(currentQuestion.nextQuestion);
    }
  };

  const handleInputSubmit = (e, question) => {
    e.preventDefault();
    const answer = e.target.answer.value;
    handleAnswer(answer, question);
    e.target.reset();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      {currentQuestion && (
        <div>
          <h2>Question {currentQuestion.id + 1}</h2>
          <p>{currentQuestion.questionText}</p>
          {currentQuestion.isChoice ? (
            <div>
              <List component='div' aria-label='choices'>
                {
                  currentQuestion.choiceAnswers.map((choice, index) => (
                    <ListItemButton key={index} onClick={() => handleAnswer(choice, currentQuestion)}>
                      <ListItemText primary={choice} />
                    </ListItemButton>
                  ))
                }
              </List>
            </div>
          ) : (
            <Grid container component="form" onSubmit={(e) => handleInputSubmit(e, currentQuestion)} spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                name="answer"
                label="Answer"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
          )}
        </div>
      )}
      {!currentQuestion && <div><p>Quiz completed!</p>
      <p>Total questions answered: {answeredQuestionsAmount}</p>
      <p>Correct answers: {correctAnswersAmount}</p>
      <p>Success rate: {correctAnswersAmount / answeredQuestionsAmount * 100}%</p>
      </div>
      }
    </div>
  );
}
export default QuizSolving;