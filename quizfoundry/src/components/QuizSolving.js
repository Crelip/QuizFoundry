import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from '@emotion/react';
import _ from 'lodash';

function QuizSolving({theme, initialQuestion }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answeredQuestionsAmount, setAnsweredQuestionsAmount] = useState(0);
  const [correctAnswersAmount, setCorrectAnswersAmount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentChoices, setCurrentChoices] = useState(null);

  async function fetchQuestion(questionId) {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + 'question/' + questionId + '/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function fetchCorrectAnswers(questionId){
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + 'correct/' + questionId + '/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function fetchNextQuestions(questionId){
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + 'next/' + questionId + '/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function fetchChoices(questionId){
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + 'choices/' + questionId + '/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


  const handleAnswer = (answer, question) => {
    answer = _.lowerCase(_.deburr(answer));
    let ans = false;
    setAnsweredQuestionsAmount(answeredQuestionsAmount + 1);
  
    // Getting correct answers from API and checking the correctness
    const correctAnswersPromise = fetchCorrectAnswers(question.id);
    const nextQuestionPromise = fetchNextQuestions(question.id);
  
    // Wait for both promises to finish
    Promise.all([correctAnswersPromise, nextQuestionPromise])
      .then(([correctAnswers, nextQuestion]) => {
        const correctAnswersNormalised = correctAnswers.map(element => {
          console.log(element.correctAnswer);
          return _.lowerCase(_.deburr(element.correctAnswer));
        });
  
        if (correctAnswersNormalised.includes(answer)) {
          setCorrectAnswersAmount(correctAnswersAmount + 1);
          ans = true;
        }
  
        const updatedUserAnswers = [...userAnswers, answer];
        // Finding the next question (if no next question, it should be -1)
        console.log(nextQuestion.length)
        if(nextQuestion.length === 0){
          setCurrentQuestionIndex(-1);
          setCurrentQuestion(null);
        }
        else if (question.dynamicNext) {
          changeQuestion(nextQuestion.find(choice => _.lowerCase(_.deburr(choice.answer)) === answer).nextQuestionID);
        } 
        else {
          changeQuestion(nextQuestion[0].nextQuestionID);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  
    return ans;
  };

  const changeQuestion = (nextQuestionID) => {
    fetchChoices(nextQuestionID)
    .then((choices) => {
      setCurrentChoices(choices.map(choice => choice.choiceAnswer));
    });
    fetchQuestion(nextQuestionID)
    .then((nextQuestion) => {
      setCurrentQuestionIndex(nextQuestion.nextQuestionID);
      setCurrentQuestion(nextQuestion);
    });
  }

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

  useEffect(() => {
    async function fetchInitialQuestion() {
      try {
        const data = await fetchQuestion(initialQuestion);
        fetchChoices(initialQuestion)
        .then((choices) => {
          setCurrentChoices(choices.map(choice => choice.choiceAnswer));
          setCurrentQuestion(data);
        });
      } catch (error) {
        console.error('Error fetching initial question:', error);
      }
    }

    if (!currentQuestion && answeredQuestionsAmount === 0) {
      fetchInitialQuestion();
    }
  }, [initialQuestion, currentQuestion, answeredQuestionsAmount]);

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
                  //List all of the choices
                  currentChoices.map((choice, index) => (
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
      {(!currentQuestion && answeredQuestionsAmount === 0) && <p>Loading...</p>}
      {!currentQuestion && answeredQuestionsAmount !== 0 && <div><p>Quiz completed!</p>
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