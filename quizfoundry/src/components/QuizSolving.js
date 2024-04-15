import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@emotion/react';
import _ from 'lodash';

function QuizSolving({theme, questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answeredQuestionsAmount, setAnsweredQuestionsAmount] = useState(0);
  const [correctAnswersAmount, setCorrectAnswersAmount] = useState(0);

  const handleAnswer = (answer, question) => {
    answer = _.lowerCase(_.deburr(answer));
    setAnsweredQuestionsAmount(answeredQuestionsAmount + 1);
    const correctAnswersNormalised = question.correctAnswers.map(element => {
      return _.lowerCase(_.deburr(element));
    });
    let ans = false;
    if(correctAnswersNormalised.includes(answer)) {
      setCorrectAnswersAmount(correctAnswersAmount + 1);
      ans = true;
    }
    const updatedUserAnswers = [...userAnswers, answer];
    setUserAnswers(updatedUserAnswers);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.dynamicNext) {
      const nextIndex = currentQuestion.nextQuestion(answer);
      setCurrentQuestionIndex(nextIndex);
    } else {
      setCurrentQuestionIndex(currentQuestion.nextQuestion);
    }
    return ans;
  };

  const handleInputSubmit = (e, question) => {
    e.preventDefault();
    const answer = e.target.answer.value;
    const ans = isCorrectAnswer(answer, question);
    e.target.reset();
    return ans;
  };

  let isCorrectAnswer = (choice, currentQuestion) => {
    const isCorrect = handleAnswer(choice, currentQuestion);
    console.log(isCorrect);
  }

  const currentQuestion = questions[currentQuestionIndex];


  return (
    <div>
      <ThemeProvider theme={theme}>
      {currentQuestion && (
        <div>
          <h2>Question {answeredQuestionsAmount + 1}</h2>
          <p>{currentQuestion.questionText}</p>
          {currentQuestion.isChoice ? (
            <div>
              <List component='div' aria-label='choices'>
                {
                  currentQuestion.choiceAnswers.map((choice, index) => (
                    <ListItemButton key={index} onClick={() => isCorrectAnswer(choice, currentQuestion)}>
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
      </ThemeProvider>
    </div>
  );
}
export default QuizSolving;