import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LooksOne as LooksOneIcon,
} from "@mui/icons-material";

export default function QuizCreation({ quizID }) {
  const [finishedCreating, setFinishedCreating] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);
  const [newCorrectAnswers, setNewCorrectAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isChoice, setIsChoice] = useState(false);
  const onAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };
  const onDeleteQuestion = (questionId) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.filter((question) => question.id !== questionId);
    });
  };

  //Creating a new question
  const handleAddQuestion = async () => {
    let questionID = 0;
    //Send a POST request to backend
    //Sending the question first
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "add_question/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizID: quizID,
            questionText: newQuestion,
            isChoice: newAnswers.length > 1,
            dynamicNext: false,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        questionID = data.id;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    //For now we are just making a new question to be after a question created right before it (unless there were no questions before)
    if (lastQuestion !== 0) {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "add_next_question/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: lastQuestion,
              answer: "-",
              nextQuestion: questionID,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    //For now setting the first question to be created to be the first question of a quiz
    else {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "update_first_question/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: quizID,
              firstQuestion: questionID,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    //Setting the correct answers
    newCorrectAnswers.forEach(async (correctAnswer) => {
      if (newAnswers.includes(correctAnswer)) {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_URL + "add_correct_answer/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: questionID,
                correctAnswer: correctAnswer,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });

    //Setting the choice answers
    if (newAnswers.length > 1) {
      newAnswers.forEach(async (answer) => {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_URL + "add_choice_answer/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: questionID,
                choiceAnswer: answer,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }

    onAddQuestion({
      id: questionID,
      questionText: newQuestion,
      isChoice: newAnswers.length > 1,
      choiceAnswers: newAnswers,
      correctAnswers: newCorrectAnswers,
      dynamicNext: false,
      nextQuestion: 0,
    });
    setIsDialogOpen(false);
    setNewQuestion("");
    setNewAnswers([""]);
    setNewCorrectAnswers([""]);
    setLastQuestion(questionID);
  };

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, ""]);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers.splice(index, 1);
    setNewAnswers(updatedAnswers);
  };

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = event.target.value;
    setNewAnswers(updatedAnswers);
  };

  const handleAddCorrectAnswer = () => {
    setNewCorrectAnswers([...newCorrectAnswers, ""]);
  };

  const handleCorrectAnswerChange = (index, event) => {
    const updatedCorrectAnswers = [...newCorrectAnswers];
    updatedCorrectAnswers[index] = event.target.value;
    setNewCorrectAnswers(updatedCorrectAnswers);
  };

  const handleRemoveCorrectAnswer = (index) => {
    const updatedCorrectAnswers = [...newCorrectAnswers];
    updatedCorrectAnswers.splice(index, 1);
    setNewCorrectAnswers(updatedCorrectAnswers);
  };

  async function handleRemoveQuestion(id) {
    onDeleteQuestion(id);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "remove_question/" + id + "/",
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const finishQuizCreation = () => {
    setFinishedCreating(true);
  };

  async function setAsFirstQuestion(id) {
    removeAllQuestionsBefore(id);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "update_first_question/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstQuestion: id,
            id: quizID,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //Need this function for now
  function removeAllQuestionsBefore(id) {
    const toRemove = questions.filter((question) => question.id < id);
    toRemove.forEach((question) => handleRemoveQuestion(question.id));
  }

  function handleToggleCorrectAnswer(index) {
    if (newCorrectAnswers.includes(newAnswers[index]))
      handleRemoveCorrectAnswer(newCorrectAnswers.indexOf(newAnswers[index]));
    else handleAddNewCorrectAnswer(newAnswers[index]);
  }

  function handleAddNewCorrectAnswer(text) {
    setNewCorrectAnswers([...newCorrectAnswers, text]);
  }

  return (
    <div>
      {finishedCreating ? (
        <div>
          <Typography>Finished creating quiz</Typography>
          <Typography variant="h5">
            The quiz code is: <b>{quizID}</b>
          </Typography>
        </div>
      ) : (
        <div>
          <List>
            {questions.map((question, index) => (
              <ListItem key={question.id} divider>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={9}>
                    <ListItemText primary={question.questionText} />
                  </Grid>
                  <Grid item xs={3} container justifyContent="flex-end">
                    <IconButton onClick={() => setAsFirstQuestion(question.id)}>
                      <LooksOneIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>

          <Grid container direction="row" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsDialogOpen(true)}
              >
                Add Question
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => finishQuizCreation()}
              >
                Finish making the quiz
              </Button>
            </Grid>
          </Grid>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={isChoice}
                    onChange={() => {
                      setIsChoice(!isChoice);
                      setNewAnswers([""]);
                      setNewCorrectAnswers([]);
                    }}
                  />
                }
                label="Is choice"
              />
              <TextField
                margin="normal"
                label="Question Text"
                fullWidth
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              {isChoice && (
                <div>
                  {newAnswers.map((answer, index) => (
                    <div key={index}>
                      <TextField
                        margin="normal"
                        label={`Answer ${index + 1}`}
                        fullWidth
                        value={answer}
                        onChange={(e) => handleAnswerChange(index, e)}
                      />
                      {index > 0 && (
                        <IconButton onClick={() => handleRemoveAnswer(index)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </div>
                  ))}
                  <Button color="primary" onClick={handleAddAnswer}>
                    Add Answer
                  </Button>
                </div>
              )}

              <Typography variant="h6">Correct answers</Typography>

              {isChoice ? (
                <div>
                  {newAnswers.map((answer, index) => (
                    <ListItem
                      key={index}
                      dense
                      onClick={() => handleToggleCorrectAnswer(index)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={newCorrectAnswers.includes(answer)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={answer} />
                    </ListItem>
                  ))}
                </div>
              ) : (
                <div>
                  {newCorrectAnswers.map((correctAnswer, index) => (
                    <div key={index}>
                      <TextField
                        margin="normal"
                        label={`Correct Answer ${index + 1}`}
                        fullWidth
                        value={correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(index, e)}
                      />
                      {index > 0 && (
                        <IconButton
                          onClick={() => handleRemoveCorrectAnswer(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!isChoice && (
                <div>
                  <Button color="primary" onClick={handleAddCorrectAnswer}>
                    Add A Correct Answer
                  </Button>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddQuestion} color="primary">
                Add Question
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
