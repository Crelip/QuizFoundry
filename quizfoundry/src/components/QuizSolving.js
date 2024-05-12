import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import _ from "lodash";
import { Typography } from "@mui/material";
import QuestionCorrectness from "./QuestionCorrectness";

export default function QuizSolving({ initialQuestion, quizID, userID }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [answeredQuestionsAmount, setAnsweredQuestionsAmount] = useState(0);
  const [correctAnswersAmount, setCorrectAnswersAmount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentChoices, setCurrentChoices] = useState(null);
  const [questionResult, setQuestionResult] = useState("");

  async function fetchQuestion(questionId) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "question/" + questionId + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchCorrectAnswers(questionId) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "correct/" + questionId + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchNextQuestions(questionId) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "next/" + questionId + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("next questions:");
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function fetchChoices(questionId) {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "choices/" + questionId + "/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
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
        const correctAnswersNormalised = correctAnswers.map((element) => {
          return _.lowerCase(_.deburr(element.correctAnswer));
        });

        if (correctAnswersNormalised.includes(answer)) {
          setCorrectAnswersAmount(correctAnswersAmount + 1);
          ans = true;
          setQuestionResult("You answered correctly!");
        }
        setUserAnswers([
          ...userAnswers,
          { questionID: question.id, answer: answer, isCorrect: ans },
        ]);
        // Finding the next question (if no next question, it should be -1)
        if (nextQuestion.length === 0) {
          setCurrentQuestion(null);
          finishQuiz([
            ...userAnswers,
            {
              questionID: question.id,
              answer: answer,
              isCorrect: ans,
            },
          ]);
        } else if (question.dynamicNext) {
          changeQuestion(
            nextQuestion.find(
              (choice) => _.lowerCase(_.deburr(choice.answer)) === answer
            ).nextQuestion
          );
        } else {
          changeQuestion(nextQuestion[0].nextQuestion);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    if (!ans) setQuestionResult("You answered incorrectly!");
    return ans;
  };

  const changeQuestion = (nextQuestionID) => {
    fetchChoices(nextQuestionID).then((choices) => {
      setCurrentChoices(choices.map((choice) => choice.choiceAnswer));
    });
    fetchQuestion(nextQuestionID).then((nextQuestion) => {
      setCurrentQuestion(nextQuestion);
    });
  };

  const handleInputSubmit = (e, question) => {
    e.preventDefault();
    const answer = e.target.answer.value;
    const ans = isCorrectAnswer(answer, question);
    e.target.reset();
    return ans;
  };

  const isCorrectAnswer = (choice, currentQuestion) => {
    return handleAnswer(choice, currentQuestion);
  };

  const finishQuiz = async (answers) => {
    let answerID;
    //Send the results to the backend
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "add_answer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizID: quizID,
            userID: userID,
            correctAnswers: answers.filter((answer) => answer.isCorrect).length,
            totalQuestions: answeredQuestionsAmount + 1,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        answerID = data.id;
      } else return;
    } catch (error) {
      console.error("Error:", error);
      return;
    }
    answers.forEach(async (answer) => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "add_answer_question/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answerID: answerID,
              questionID: answer.questionID,
              answer: answer.answer,
              isCorrect: answer.isCorrect,
            }),
          }
        );
      } catch (error) {
        console.error("Error:", error);
      }
    });
  };

  useEffect(() => {
    async function fetchInitialQuestion() {
      try {
        const data = await fetchQuestion(initialQuestion);
        fetchChoices(initialQuestion).then((choices) => {
          setCurrentChoices(choices.map((choice) => choice.choiceAnswer));
          setCurrentQuestion(data);
        });
      } catch (error) {
        console.error("Error fetching initial question:", error);
      }
    }

    if (!currentQuestion && answeredQuestionsAmount === 0) {
      fetchInitialQuestion();
    }
  }, [initialQuestion, currentQuestion, answeredQuestionsAmount]);

  return (
    <div>
      {currentQuestion && (
        <div>
          <QuestionCorrectness text={questionResult} />
          <Typography variant="h4">
            Question {answeredQuestionsAmount + 1}
          </Typography>
          <Typography>{currentQuestion.questionText}</Typography>
          {currentQuestion.isChoice ? (
            <div>
              <List component="div" aria-label="choices">
                {
                  //List all of the choices
                  currentChoices.map((choice, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => isCorrectAnswer(choice, currentQuestion)}
                    >
                      <ListItemText primary={choice} />
                    </ListItemButton>
                  ))
                }
              </List>
            </div>
          ) : (
            <Grid
              container
              component="form"
              onSubmit={(e) => handleInputSubmit(e, currentQuestion)}
              spacing={2}
            >
              <Grid item xs={12}>
                <TextField fullWidth type="text" name="answer" label="Answer" />
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
      {!currentQuestion && answeredQuestionsAmount === 0 && <p>Loading...</p>}
      {!currentQuestion && answeredQuestionsAmount !== 0 && (
        <div>
          <Typography>Quiz completed!</Typography>
          <Typography>
            Total questions answered: {answeredQuestionsAmount}
          </Typography>
          <Typography>Correct answers: {correctAnswersAmount}</Typography>
          <Typography>
            Success rate:{" "}
            {parseFloat(
              (correctAnswersAmount / answeredQuestionsAmount) * 100
            ).toFixed(2)}
            %
          </Typography>
        </div>
      )}
    </div>
  );
}
