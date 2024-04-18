import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const QuizCreation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);
  const [newCorrectAnswers, setNewCorrectAnswers] = useState([""]);
  const [questions, setQuestions] = useState([
    {
      id: 0,
      questionText: "Z akej krajiny pochadza mandarinka Darinka?",
      isChoice: true,
      choiceAnswers: ["Grecko", "Spanielsko", "Estonsko", "Portugalsko"],
      correctAnswers: ["Grecko"],
      dynamicNext: true,
      nextQuestion: function (answer) {
        return answer === "Grecko" ? 1 : 2;
      },
    },
    {
      id: 1,
      questionText: "Kolko dni a noci stravila mandarinka Darinka v tranzite?",
      isChoice: false,
      correctAnswers: ["20"],
      nextQuestion: 3,
    },
    {
      id: 2,
      questionText: "Kto sa zalubil do mandarinky Darinky?",
      isChoice: false,
      correctAnswers: ["Jeden pomaranc", "Ovocie"],
      nextQuestion: 3,
    },
    {
      id: 3,
      questionText: "O com vedel cely strom?",
      isChoice: true,
      choiceAnswers: [
        "Ze uz je na svadbu cas",
        "Ze paraziti napadli strom",
        "Ze strom niekto ide obrat",
      ],
      correctAnswers: ["Ze uz je na svadbu cas"],
      dynamicNext: false,
      nextQuestion: -1,
    },
  ]);
  const onAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };
  const onDeleteQuestion = (questionId) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.filter((question) => question.id !== questionId);
    });
  };

  //Creating a new question
  const handleAddQuestion = () => {
    onAddQuestion({
      id: questions.length,
      questionText: newQuestion,
      isChoice: newAnswers.length > 1,
      choiceAnswers: newAnswers,
      correctAnswers: newCorrectAnswers,
      dynamicNext: false,
      nextQuestion: -1,
    });
    setIsDialogOpen(false);
    setNewQuestion("");
    setNewAnswers([""]);
    setNewCorrectAnswers([""]);
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

  const handleRemoveQuestion = (id) => {
    onDeleteQuestion(id);
  };

  return (
    <div>
      <Typography variant="h5">Quiz Creation</Typography>
      <List>
        {questions.map((question) => (
          <ListItem key={question.id}>
            <ListItemText primary={question.questionText} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => handleRemoveQuestion(question.id)}
                edge="end"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        Add Question
      </Button>

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
                <IconButton onClick={() => handleRemoveCorrectAnswer(index)}>
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
  );
};

export default QuizCreation;
