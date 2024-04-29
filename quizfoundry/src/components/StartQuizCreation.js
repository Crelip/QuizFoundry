import { Grid, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import QuizCreation from "./QuizCreation";

const StartQuizCreation = ({ userID, setHeader }) => {
  const [quizName, setQuizName] = useState("");
  const [isQuiz, setIsQuiz] = useState(false);
  const [quizID, setQuizID] = useState(0);
  const handleStartQuizCreation = async (e) => {
    e.preventDefault();
    //Send a POST request to REST API containing userID and Quiz name
    //We should also receive quiz id
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "create_quiz/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizName: quizName,
            quizOwner: userID,
            firstQuestion: 0,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setQuizID(data.id);
        setIsQuiz(true);
        setHeader('Creating "' + quizName + '"');
      } else {
        console.error("Failed to create quiz:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!isQuiz) setHeader("Start making a quiz");
  });

  return (
    <div>
      {isQuiz ? (
        <QuizCreation quizID={quizID} />
      ) : (
        <div>
          <form onSubmit={handleStartQuizCreation}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  label="Enter quiz name"
                  variant="outlined"
                  onChange={(e) => setQuizName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Start making a quiz
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </div>
  );
};
export default StartQuizCreation;
