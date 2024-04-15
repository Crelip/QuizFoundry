import React, { useState } from 'react';

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
              {currentQuestion.choiceAnswers.map((choice, index) => (
                <button key={index} onClick={() => handleAnswer(choice, currentQuestion)}>
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => handleInputSubmit(e, currentQuestion)}>
              <input type="text" name="answer" />
              <button type="submit">Submit</button>
            </form>
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