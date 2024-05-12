import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

export default function QuizCreation({ quizID }) {
  const [finishedCreating, setFinishedCreating] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);
  const [newCorrectAnswers, setNewCorrectAnswers] = useState([""]);
  const [questions, setQuestions] = useState([]);
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
              questionID: lastQuestion,
              answer: "-",
              nextQuestionID: questionID,
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
                    <IconButton onClick={() => handleEditQuestion(question.id)}>
                      <EditIcon />{" "}
                      {/* You should import EditIcon from @mui/icons-material */}
                    </IconButton>
                    <IconButton
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      <DeleteIcon />
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
              <TextField
                margin="normal"
                label="Question Text"
                fullWidth
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
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
              <Box sx={{ color: "text.secondary", fontSize: 8 }}>
                Don't add answers if you don't want this to be a choice question
              </Box>

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
              <Button color="primary" onClick={handleAddCorrectAnswer}>
                Add A Correct Answer
              </Button>
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
