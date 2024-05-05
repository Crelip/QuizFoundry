import { Button, Typography } from "@mui/material";
import React from "react";
export default function WelcomeScreen({ handleStartQuizCreation }) {
  return (
    <div>
      <Typography variant="h2">Welcome to QuizFoundry!</Typography>
      <Button
        sx={{ margin: 2 }}
        variant="contained"
        onClick={handleStartQuizCreation}
      >
        Create a quiz
      </Button>
    </div>
  );
}
