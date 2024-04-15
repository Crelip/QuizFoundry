import React, { useState } from 'react';

function QuizSolving({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleAnswer = (answer) => {
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

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const answer = e.target.answer.value;
    handleAnswer(answer);
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
                <button key={index} onClick={() => handleAnswer(choice)}>
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleInputSubmit}>
              <input type="text" name="answer" />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}
      {!currentQuestion && <p>Quiz completed!</p>}
    </div>
  );
}
export default QuizSolving;