import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import QuizSolving from "./QuizSolving";
import { AuthProvider } from "./context/AuthContext";
import Login from "./Login";
import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
const App = () => {
  let { quizID } = useParams();
  const [currentView, setCurrentView] = useState(null);
  const [showQuizCreation, setShowQuizCreation] = useState(false);
  const [showQuizSolving, setShowQuizSolving] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const startShowQuizCreation = () => {
    setCurrentView("quizCreation");
  };
  const questions = [1, 2];

  const startShowQuizSolving = () => {
    setCurrentView("quizSolving");
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: green[400],
      },
      secondary: {
        main: green[800],
      },
    },
  });

  const fetchSearchResult = async (questionId) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "quiz/" + questionId + "/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const quiz = await response.json();
    if (quiz.firstQuestion === 0)
      throw new Error("Failed to fetch search results.");
    setCurrentQuiz(quiz);
    startShowQuizSolving();
    return quiz;
  };

  useEffect(() => {
    if (quizID) {
      fetchSearchResult(quizID);
    }
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Navbar
          startQuizCreation={startShowQuizCreation}
          fetchSearchResult={fetchSearchResult}
        />
        <Container>
          {currentView === "quizSolving" && (
            <QuizSolving
              initialQuestion={currentQuiz.firstQuestion}
              quizID={currentQuiz.id}
            />
          )}
          {currentView === "quizCreation" && (
            <AuthProvider>
              <Login />
            </AuthProvider>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default App;
