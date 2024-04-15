import React, {useState} from 'react';
import { Container } from '@mui/material';
import Navbar from './Navbar';
import QuizCreation from './QuizCreation';

const App = () => {
    const [showQuizCreation, setShowQuizCreation] = useState(false);

    const startShowQuizCreation = () => {
        setShowQuizCreation(true);
    }

    const [questions, setQuestions] = useState([
        {id: 0,
            questionText: "Z akej krajiny pochadza mandarinka Darinka?",
            isChoice: true,
            choiceAnswers: ["Grecko", "Spanielsko", "Estonsko", "Portugalsko"],
            correctAnswers: ["Grecko"],
            dynamicNext: true,
            nextQuestion: function(answer) {
                return answer === "Grecko" ? 1 : 2;
            }
        },
        {  
            id: 1,
            questionText: "Kolko dni a noci stravila mandarinka Darinka v tranzite?",
            isChoice: false,
            correctAnswers: ["20"],
            nextQuestion: 3
        },
        {
            id: 2,
            questionText: "Kto sa zalubil do mandarinky Darinky?",
            isChoice: false,
            correctAnswers: ["Jeden pomaranc", "Ovocie"],
            nextQuestion: 3
        },
        {
            id: 3,
            questionText: "O com vedel cely strom?",
            isChoice: true,
            choiceAnswers: ["Ze uz je na svadbu cas", "Ze paraziti napadli strom", "Ze strom niekto ide obrat"],
            correctAnswers: ["Ze uz je na svadbu cas"],
            dynamicNext: false,
            nextQuestion: -1
        }
    ]);

    const handleAddQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion]);
    };
    const handleDeleteQuestion = (questionId) => {
        setQuestions(prevQuestions => {
            return prevQuestions.filter((question) => question.id !== questionId);
          });
      };

  return (
    <div>
      <Navbar startQuizCreation={startShowQuizCreation} />
      <Container>
        {showQuizCreation && <QuizCreation questions={questions} onAddQuestion={handleAddQuestion} onDeleteQuestion={handleDeleteQuestion}/>}
      </Container>
    </div>
  );
};

export default App;