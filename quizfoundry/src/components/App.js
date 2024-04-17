import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './Navbar';
import QuizCreation from './QuizCreation';
import QuizSolving from './QuizSolving';
import { createTheme } from '@mui/material';
import { green } from '@mui/material/colors';
const App = () => {
    let {quizID} = useParams();
    const [showQuizCreation, setShowQuizCreation] = useState(false);
    const [showQuizSolving, setShowQuizSolving] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const startShowQuizCreation = () => {
        setShowQuizCreation(true);
    }

    const startShowQuizSolving = () => {
        setShowQuizSolving(true);
    }

    const theme = createTheme({
        palette:{
            primary:{
                main: green[400],
            },
            secondary:{
                main: green[800],
            },
        },
      });

    const handleAddQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion]);
    };
    const handleDeleteQuestion = (questionId) => {
        setQuestions(prevQuestions => {
            return prevQuestions.filter((question) => question.id !== questionId);
          });
      };

    const fetchSearchResult = async (questionId) => {
        const response = await fetch(process.env.REACT_APP_API_URL + 'quiz/' + questionId + '/');
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const quiz = await response.json();
        setCurrentQuiz(quiz);
        startShowQuizSolving();
        return quiz;
    };

    useEffect(() => {
      if(quizID){
        fetchSearchResult(quizID);
      }
    }
    );


  return (
    <div>
      <Navbar theme={theme} startQuizCreation={startShowQuizCreation} fetchSearchResult={fetchSearchResult} />
      <Container>
        {showQuizCreation && <QuizCreation theme={theme} questions={questions} onAddQuestion={handleAddQuestion} onDeleteQuestion={handleDeleteQuestion}/>}
        {showQuizSolving && <QuizSolving theme={theme} initialQuestion={currentQuiz.firstQuestion}/>}
      </Container>
    </div>
  );
};

export default App;