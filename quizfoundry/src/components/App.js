import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, ThemeProvider } from "@mui/material";
import Navbar from "./Navbar";
import QuizSolving from "./QuizSolving";
import { AuthProvider } from "./context/AuthContext";
import Login from "./Login";
import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import WelcomeScreen from "./WelcomeScreen";
import StartQuizCreation from "./StartQuizCreation";
import UserHistory from "./UserHistory";
export default function App() {
  let { quizID } = useParams();
  const [currentView, setCurrentView] = useState("welcomeScreen");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [header, setHeader] = useState("QuizFoundry");
  const [currentUser, setCurrentUser] = useState(-1);
  const [currentUsername, setCurrentUsername] = useState("");
  const showLoginScreen = () => {
    setCurrentView("loginScreen");
  };

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

  const fetchSearchResult = async (questionID) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "quiz/" + questionID + "/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const quiz = await response.json();
    if (quiz.firstQuestion === 0)
      throw new Error("Failed to fetch search results.");
    setCurrentQuiz(quiz);
    startShowQuizSolving();
    setHeader(quiz.quizName);
    return quiz;
  };

  const handleStartQuizCreation = () => {
    //If the user is not signed in, it will open the login screen.
    if (currentUser === -1) setCurrentView("loginScreen");
    //If the user is signed in, it will directly open the quiz creation screen.
    else setCurrentView("quizCreation");
  };

  const logOut = () => {
    setCurrentUser(-1);
    window.location.reload();
  };

  const showUserHistory = () => {
    setCurrentView("userHistory");
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
          showLoginScreen={showLoginScreen}
          fetchSearchResult={fetchSearchResult}
          header={header}
          currentUser={currentUser}
          logOut={logOut}
          showUserHistory={showUserHistory}
          username={currentUsername}
        />
        <Container>
          {currentView === "welcomeScreen" && (
            <WelcomeScreen handleStartQuizCreation={handleStartQuizCreation} />
          )}
          {currentView === "quizSolving" && (
            <QuizSolving
              initialQuestion={currentQuiz.firstQuestion}
              quizID={currentQuiz.id}
              userID={currentUser}
            />
          )}
          {currentView === "loginScreen" && (
            <AuthProvider>
              <Login
                setHeader={setHeader}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setCurrentUsername={setCurrentUsername}
                setCurrentView={setCurrentView}
              />
            </AuthProvider>
          )}
          {currentView === "quizCreation" && (
            <StartQuizCreation userID={currentUser} setHeader={setHeader} />
          )}
          {currentView === "userHistory" && (
            <UserHistory userID={currentUser} username={currentUsername} />
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
}
